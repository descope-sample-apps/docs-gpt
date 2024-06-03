import cheerio from 'cheerio';
import { URL } from 'url';
import * as fs from 'fs';
import OpenAI from "openai";
import { promisify } from 'util';
import path from 'path';
import TurndownService from 'turndown';
import { Readability } from '@mozilla/readability';
import { JSDOM } from "jsdom"

import FirecrawlApp from "@mendable/firecrawl-js";

const app = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY!,
});


const openai = new OpenAI();
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

class Crawler {
    private baseURL: string;
    private baseHost: string;
    private visited = new Set<string>();
    private queue: string[] = [];
    private vectorStoreId: string;
    private tempDirectory: string = './temp'; // Ensure this directory exists
    private fileBatch: string[] = []; // Store file paths for batch upload
    private batchLimit: number = 500; // Number of files per batch upload

    constructor(baseURL: string, vectorStoreId: string) {
        this.baseURL = baseURL;
        this.vectorStoreId = vectorStoreId;
        const parsedUrl = new URL(baseURL);
        this.baseHost = parsedUrl.host;
        this.queue.push(baseURL); // Initialize queue with the base URL
    }

    async crawl(): Promise<void> {
        while (this.queue.length > 0) {
            const url = this.queue.shift()!;
            if (this.visited.has(url)) continue;
            this.visited.add(url);

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const html = await response.text();

                const $ = cheerio.load(html);
                let content;
                console.log('Crawling:', url);
                var doc = new JSDOM(html, { url });
                var article = new Readability(doc.window.document).parse();
                if (article) {
                    content = article.textContent
                } else {
                    const scrapedData = await app.scrapeUrl(url);
                    content = scrapedData.data.content;
                }            

                // Save content to a temporary file
                const safefilename = this.createSafeFilename(url) + '.txt'; 
                const filepath = path.join(this.tempDirectory, safefilename);
                console.log(filepath)
                await writeFileAsync(filepath, content);
                this.fileBatch.push(filepath);

                if (this.fileBatch.length >= this.batchLimit) {
                    await this.uploadFiles(); // Upload when batch limit is reached
                }

                $('a').each((_, element) => {
                    const href = $(element).attr('href');
                    if (href) {
                        const fullUrl = new URL(href, url).toString();
                        if (!fullUrl.includes('#') && new URL(fullUrl).host === this.baseHost && !this.visited.has(fullUrl)) {
                            this.queue.push(fullUrl);
                        }
                    }
                });

            } catch (error) {
                console.error(`Failed to fetch ${url}:`, error);
            }
        }
        if (this.fileBatch.length > 0) {
            await this.uploadFiles(); // Upload any remaining files after crawling
        }
    }

    async uploadFiles(): Promise<void> {
        console.log("Uploading batch...");
        const fileStreams = this.fileBatch.map(file => fs.createReadStream(file));
        await openai.beta.vectorStores.fileBatches.uploadAndPoll(this.vectorStoreId, {
            files: fileStreams
        });

        // Clean up files after upload
        await Promise.all(this.fileBatch.map(file => unlinkAsync(file)));
        this.fileBatch = []; // Clear the batch array
    }

    createSafeFilename(url: string): string {
        const strippedUrl = url.replace(/^https?:\/\//, '');
        return strippedUrl.replace(/[^a-zA-Z0-9]/g, '_');
    }

    async start(): Promise<void> {
        console.log('Starting the crawling process...');
        await this.crawl();
        console.log('Crawling has completed.');
    }
}

export default Crawler

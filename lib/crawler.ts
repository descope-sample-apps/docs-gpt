import cheerio from 'cheerio';
import { URL } from 'url';
import * as fs from 'fs';
import OpenAI from "openai";
import { v4 as uuidv4 } from 'uuid'; // For generating unique file names
import { promisify } from 'util';
import path from 'path';

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
                const content = $('body').text();
                console.log('Crawling:', url);

                // Save content to a temporary file
                const safefilename = this.createSafeFilename(url) + '.txt'; // Use url as filename
                // const filename = uuidv4() + '.txt'; // use random value as filename
                const filename = safefilename;
                const filepath = path.join(this.tempDirectory, filename);
                console.log(filepath)
                await writeFileAsync(filepath, content);

                console.log("Content saved...")

                // Upload the file
                const fileStream = fs.createReadStream(filepath);
                await openai.beta.vectorStores.fileBatches.uploadAndPoll(this.vectorStoreId, {
                    files: [fileStream]
                });

                // Clean up the file after upload
                await unlinkAsync(filepath);

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
    }

    createSafeFilename(url: string): string {
        // Remove 'https://' or 'http://' from the start of the URL
        const strippedUrl = url.replace(/^https?:\/\//, '');
    
        // Replace non-alphanumeric characters with underscores
        return strippedUrl.replace(/[^a-zA-Z0-9]/g, '_');
    }

    async start(): Promise<void> {
        console.log('Starting the crawling process...');
        await this.crawl();
        console.log('Crawling has completed.');
    }
}

export default Crawler
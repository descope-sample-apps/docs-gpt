import cheerio from 'cheerio';
import { URL } from 'url';

interface Document {
    title: string;
    url: string;
    content: string;
}

class Crawler {
    private baseURL: string;
    private baseHost: string;
    private visited = new Set<string>();
    private documents: Document[] = [];
    private queue: string[] = [];
    private totalSize = 0; // Property to track the total size of all pages

    constructor(baseURL: string) {
        this.baseURL = baseURL;
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
                this.totalSize += new Blob([html]).size; // Update total size with the size of the response text
                const $ = cheerio.load(html);
                const content = $('body').text();
                console.log('Crawling:', url);
                this.documents.push({
                    title: $('title').text(),
                    url: url,
                    content: content
                });

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

    async start(): Promise<Document[]> {
        await this.crawl();
        console.log(`Completed crawling all documents. Total size: ${this.totalSize} bytes.`);
        return this.documents;
    }
}

export default Crawler;

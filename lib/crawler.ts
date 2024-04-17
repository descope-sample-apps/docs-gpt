import axios from 'axios';
import cheerio from 'cheerio';
import { URL, URLSearchParams } from 'url';

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

    constructor(baseURL: string) {
        this.baseURL = baseURL;
        const parsedUrl = new URL(baseURL);
        this.baseHost = parsedUrl.host;
    }

    async crawl(url: string): Promise<void> {
        if (this.visited.has(url)) return;
        this.visited.add(url);

        try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
            const content = $('body').text(); // Adjust selector based on your needs
            this.documents.push({
                title: $('title').text(),
                url: url,
                content: content
            });

            $('a').each((_: number, element: any) => {
                const href = $(element).attr('href');
                if (href) {
                    const fullUrl = new URL(href, url).toString();
                    if (!fullUrl.includes('#') && new URL(fullUrl).host === this.baseHost) {
                        this.crawl(fullUrl); // Recursively crawl to new URL
                    }
                }
            });
        } catch (error: any) {
            console.error(`Failed to fetch ${url}:`, error.message);
        }
    }

    async start(): Promise<Document[]> {
        await this.crawl(this.baseURL);
        return this.documents;
    }
}

export default Crawler;

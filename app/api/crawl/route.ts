import Crawler from '@/lib/crawler';
export async function POST(request: Request) {
    const res = await request.json();
    const url = res.url;
    if (!url) {
        return new Response(`URL is required`, {
            status: 500,
        })
    }

    const crawler = new Crawler(url);
    try {
        const documents = await crawler.start();
        return new Response(JSON.stringify({ urls: documents.map(doc => doc.url) }));
    } catch (error: any) {
        return new Response(`Error crawling site: ${error.message}`, {
            status: 500,
        })
    }
}
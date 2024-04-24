import Crawler from '@/lib/crawler';

export async function POST(request: Request) {
    const res = await request.json();
    const url = res.url;
    const vectorStoreId = res.vectorStoreId;
    if (!url) {
        return new Response(`URL is required`, {
            status: 500,
        })
    }

    if (!vectorStoreId) {
        return new Response(`Vector store ID required`, {
            status: 500,
        })
    }

    const crawler = new Crawler(url, vectorStoreId);

    try {
        const documents = await crawler.start();

        return new Response(JSON.stringify({
            success: "true"
        }))
    } catch (error: any) {
        return new Response(`Error crawling site: ${error.message}`, {
            status: 500,
        })
    }
}

import Chat from "@/components/assistant/assistant";
import CrawlerInput from "@/components/crawler/CrawlerInput";

export default function Home() {
    return (
        <>
            <div className="z-10 w-full max-w-xl px-5 xl:px-0">
                <p className="mt-6 text-center text-gray-500 [text-wrap:balance] md:text-xl">
                   Check out your server logs to see crawling progress.
                </p>
                <br/>
                <CrawlerInput />
            </div>
        </>
    );
}

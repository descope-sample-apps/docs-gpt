'use client'

import CrawlerInput from "@/components/crawler/CrawlerInput";
import { useSession, useUser } from "@descope/nextjs-sdk/client";

export default function Home() {
    const { isSessionLoading, sessionToken, isAuthenticated } = useSession();
    
    const { user, isUserLoading } = useUser();
    const isUserAdmin = user?.roleNames?.includes("admin");
    
    if (isSessionLoading || isUserLoading) {
        return <div>...</div>;
    }
    if (!isUserLoading && !isUserAdmin) {
        return <div>You need to have the &apos;admin&apos; role to access this page.</div>;
    }
    return (
        <>
            <div className="z-10 w-full max-w-xl px-5 xl:px-0">
                <p className="mt-6 text-gray-500 md:text-sm">
                   After creating a vector store in OpenAI and attaching it to 
                   an assistant, you can include both the vector store ID and 
                   the url to your docs site to crawl and upload to the vector store.
                </p>
                <br/>
                <CrawlerInput />
            </div>
        </>
    );
}

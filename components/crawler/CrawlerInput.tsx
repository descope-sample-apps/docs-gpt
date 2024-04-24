'use client'

import { useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Link from 'next/link';

export default function CrawlerInput() {
    const [isLoading, setIsLoading] = useState(false);
    const [done, setDone] = useState(false);
    
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        const url = e.target.url.value;
        const vectorStoreId = e.target.vectorStoreId.value;

        if (!url) {
            alert('Documentation URL is required');
            return;
        }

        if (!vectorStoreId) {
            alert('Vector store ID is required');
            return;
        }

        const response = await fetch('/api/crawl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url, vectorStoreId }),
        });
        const data = await response.json();

        setIsLoading(false);

        setDone(true);
    };

    return (
        <>
        {!done && (
            <form onSubmit={handleSubmit}>
            <div className="flex w-full items-center space-x-2">
                <Input name="url" type="url" placeholder="Documentation site URL (eg. https://docs.descope.com)" />
                <Input name="vectorStoreId" type="text" placeholder="Vector store ID" />
                <Button disabled={isLoading} type="submit">{isLoading ? 'Uploading...' : 'Upload'}</Button>
            </div>
        </form>
        )}
        {done && <p>Crawler done! Make sure your assistant id has the vector store attached and head over to <Link href="/dashboard" className="underline">chat with your bot</Link>.</p>}
        <p className="mt-4 text-gray-500 md:text-sm">Uploads can take 10-20 minutes depending on documentation site size. You can track progress in your server logs.</p>
        </>
    );
}

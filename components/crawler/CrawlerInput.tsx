'use client'

import { useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function CrawlerInput() {
    const [url, setUrl] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('/api/crawl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });
        const data = await response.json();
        console.log(data); // This will log the response from the server
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex w-full items-center space-x-2">
                <Input type="url" placeholder="Enter the url of your documentation site (eg. https://docs.descope.com)" value={url} onChange={(e) => setUrl(e.target.value)} />
                <Button type="submit">Upload to Vector Store</Button>
            </div>
        </form>
    );
}

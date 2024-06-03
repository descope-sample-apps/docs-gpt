'use client'

import Chat from "@/components/chat";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
    <Chat />
      {/* <div className="z-10 w-full max-w-4xl px-2 xl:px-0 max-h-screen bg-blue-500 overflow-auto"> */}
        {/* <p className="mt-6 text-center text-gray-500 [text-wrap:balance] md:text-xl"></p> */}
        
      {/* </div> */}
      {/* <div className="z-10 w-full max-w-xl px-5 xl:px-0">
        <h1
          className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem]"
        >
          AI Docs Chat
        </h1>
        <p
          className="mt-6 text-center text-gray-500 [text-wrap:balance] md:text-xl"
        >
          Leverage OpenAI&apos;s Assistants API with Streaming and File Search to implement custom search for your docs site.
        </p>
        <div
          className="mx-auto flex animate-fade-up items-center justify-center space-x-5"
        >
          <a href="/dashboard">
            <Button className="mt-10">Get started</Button>
          </a>
        </div>
      </div> */}
    </>
  );
}

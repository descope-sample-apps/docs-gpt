import CrawlerInput from "@/components/crawler/CrawlerInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {
  return (
    <>
      <div className="z-10 w-full max-w-xl px-5 xl:px-0">
        <CrawlerInput />
        <h1
          className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem]"
        >
          Starter template for your Next project
        </h1>
        <p
          className="mt-6 text-center text-gray-500 [text-wrap:balance] md:text-xl"
        >
          An opinionated collection of components, hooks, and utilities for your
          Next.js project, including authentication with Descope
        </p>
        <div
          className="mx-auto mt-6 flex animate-fade-up items-center justify-center space-x-5"
        >
          <a href="/auth">
            <Button className="mt-10">Get started</Button>
          </a>
        </div>
      </div>
      <div className="my-10 grid w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
        {Array.from(Array(6)).map((value, index) => (
          <Card
            key={index}
          >
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            {/* <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter> */}
          </Card>
        ))}
      </div>

    </>
  );
}

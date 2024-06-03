import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/layout/nav";
import cx from "classnames";
import { sfPro, inter } from "./fonts";
import { Suspense } from "react";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "AI Documentation Chat",
  description: "Leverage OpenAI's Assistants API with Streaming and File Search to implement custom search for your docs site.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <Providers>
      <html lang="en">
        <body className={cx(sfPro.variable, inter.variable)}>
          {/* <div className="fixed h-screen w-full" /> */}
          {/* <Suspense fallback="...">
            <Nav />
          </Suspense> */}
          <main className="flex min-h-screen w-full flex-col items-center justify-center">
          {children}
        </main>
        </body>
      </html>
   </Providers>
  );
}

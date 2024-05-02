import Chat from "@/components/chat";

export default function Home() {
    return (
        <>
            <div className="z-10 w-full max-w-4xl px-2 xl:px-0">
                <p className="mt-6 text-center text-gray-500 [text-wrap:balance] md:text-xl"></p>
                <Chat />
            </div>
        </>
    );
}

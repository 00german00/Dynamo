import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-white selection:bg-neutral-800">
      <header className="px-6 py-4 flex items-center justify-between border-b border-neutral-800">
        <h1 className="text-xl font-bold tracking-tight text-white flex gap-2 items-center">
          <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
          Dynamo
        </h1>
        <nav>
          <Link href="/dashboard">
            <Button variant="secondary" className="font-semibold text-neutral-950 bg-white hover:bg-neutral-200">
              Enter Dashboard
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-3xl mx-auto">
        <div className="inline-block mb-4 px-3 py-1 rounded-full border border-neutral-700 bg-neutral-900 text-xs text-neutral-300 font-medium">
          Contextual Sales Engine
        </div>
        <h2 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
          Stop guessing.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-white">
            Start closing.
          </span>
        </h2>
        <p className="text-neutral-400 text-lg mb-10 max-w-xl mx-auto">
          Instantly generate hype-personalized sales portals. Turn your static PDFs and decks into intelligent, trackable web experiences.
        </p>
        <Link href="/dashboard">
          <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base bg-white text-neutral-950 hover:bg-neutral-200 font-bold">
            Get Started
          </Button>
        </Link>
      </main>
    </div>
  )
}

import { BookOpen, Brain, Lightbulb, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 flex items-center justify-center">
          <div className="container flex items-center justify-center px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                    <Sparkles className="mr-1 h-4 w-4" />
                    Transform Your Scrolling Habit Today
                  </div>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Replace Doomscrolling With{" "}
                    <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-600 bg-clip-text text-transparent">
                      DoomLearning
                    </span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
					Nourish your brain with byte-sized knowledge. Turn wasted time into valuable learning.
                  </p>
                </div>
                {/* <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="px-8">
                    Sign Up
                  </Button>
                  <Button size="lg" variant="outline" className="px-8">
                    Login
                  </Button>
                </div> */}
				<div className="flex flex-col gap-4 min-[400px]:flex-row pt-4">
                  <Link
                    href="/signup"
                    className="inline-flex h-14 items-center justify-center rounded-md bg-gradient-to-r from-primary via-purple-500 to-blue-600 px-8 text-lg font-medium text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex h-14 items-center justify-center rounded-md border border-input bg-background px-8 text-lg font-medium shadow-sm transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-md hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Login
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] lg:h-[450px] lg:w-[450px]">
                  <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl"></div>
                  <div className="absolute left-1/2 top-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-white p-4 shadow-lg dark:bg-slate-800">
                        <Brain className="h-16 w-16 text-primary" />
                      </div>
                      <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-white p-4 shadow-lg dark:bg-slate-800">
                        <Lightbulb className="h-16 w-16 text-amber-500" />
                      </div>
                      <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-white p-4 shadow-lg dark:bg-slate-800">
                        <BookOpen className="h-16 w-16 text-emerald-500" />
                      </div>
                      <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-white p-4 shadow-lg dark:bg-slate-800">
                        <Sparkles className="h-16 w-16 text-violet-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full bg-primary/5 py-12 dark:bg-primary/10 flex items-center justify-center">
          <div className="container flex items-center justify-center px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Start Learning Today</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
					© 2025 Saarthak Gupta
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}






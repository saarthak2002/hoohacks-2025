"use client"

import { useState } from "react"
import { motion } from "motion/react";
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export function AnimatedSearch() {
    const [isFocused, setIsFocused] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSubmit = useDebouncedCallback(() => {
        const params = new URLSearchParams(searchParams);
        if (searchQuery) {
            params.set('query', searchQuery.trim());
        } else {
            params.delete('query');
        }
        console.log("Searching for:", searchQuery)
        replace(`${pathname}?${params.toString()}`);
    }, 300);

  // Animation variants for the title
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const wordVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  }

  const titleWords = "What would you like to learn about today?".split(" ")

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-12 space-y-6">
      <motion.h2
        className="text-2xl md:text-3xl font-bold text-center text-primary"
        initial="hidden"
        animate="visible"
        variants={titleVariants}
      >
        {titleWords.map((word, i) => (
          <motion.span key={i} className="inline-block mx-1" variants={wordVariants}>
            {word}
          </motion.span>
        ))}
      </motion.h2>

      <motion.form
        className="relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Type your topic here..."
              className={`pl-10 py-6 text-lg transition-all duration-300 ${
                isFocused ? "ring-2 ring-primary shadow-lg" : ""
              }`}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          <motion.button
            type="submit"
            className="px-6 py-2 h-[3.25rem] bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Search
          </motion.button>
        </div>

        <motion.div
          className="mt-2 text-sm text-muted-foreground text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Try searching for topics like "Albert Einstein", "Machine Learning", or "World Wide Web"
        </motion.div>
      </motion.form>
    </div>
  )
}


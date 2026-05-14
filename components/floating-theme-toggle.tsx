"use client"

import { ThemeToggle } from "@/components/theme-toggle"

export function FloatingThemeToggle() {
  return (
    <div className="fixed bottom-5 right-5 z-50 md:bottom-6 md:right-6">
      <div className="rounded-full border border-border bg-background/90 backdrop-blur-md shadow-lg shadow-black/10 p-1">
        <ThemeToggle
          size="icon"
          variant="ghost"
          className="h-11 w-11 rounded-full"
        />
      </div>
    </div>
  )
}
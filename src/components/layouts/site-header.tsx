import Link from "next/link"

import { ModeToggle } from "./dark-mode-toggle"
import { ScanEye } from "lucide-react"
import { siteConfig } from "@/config/site"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-2 flex items-center md:mr-6 md:space-x-2">
          <ScanEye className="size-8" aria-hidden="true" />
          <span className="hidden font-bold md:inline-block">
            {siteConfig.name}
          </span>
        </Link>
        {/* <nav className="flex w-full items-center gap-6 text-sm">
          <Link
            href="https://www.sadmn.com/blog/shadcn-table"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/60 transition-colors hover:text-foreground"
          >
            Docs
          </Link>
        </nav> */}
        <nav className="flex flex-1 items-center md:justify-end justify-end">
          {/* <Button variant="ghost" size="icon" className="size-8" asChild>
            <Link
              aria-label="GitHub repo"
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon className="size-4" aria-hidden="true" />
            </Link>
          </Button> */}
          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}

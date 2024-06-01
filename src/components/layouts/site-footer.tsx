import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="sticky bottom-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-12 items-center flex justify-center">
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          made with ❤️ by{" "}
          <Link className="font-bold" href="https://twitter.com/@alisyedsadiq" target="_blank">
            syedsadiqali
          </Link>{" "}
          {/* with <span className="font-bold">NextJS</span>,{" "}
          <span className="font-bold">Vercel AI SDK.</span> credits to{" "}

          {" "}
          <Link
            className="font-bold"
            href="https://ui.shadcn.com/"
          >
            shadcn
          </Link>
          ,{" "}
          <Link
            className="font-bold"
            href="https://github.com/sadmann7/file-uploader"
          >
            sadman7
          </Link> for components */}
        </p>
      </div>
    </footer>
  );
}


export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Guess GPT",
  description: "Guess GPT is a AI Vision App that helps you identify Places / People / Things in an Image.",
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://guess-gpt.vercel.app",
  links: {  },
}

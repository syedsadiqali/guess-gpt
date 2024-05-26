import { Metadata } from "next"
import Chat from "./client"

export const metadata: Metadata = {
  metadataBase: new URL('https://guess-gpt.vercel.app/'),
  title: 'Guess GPT : Guess what\'s in the image',
  description: 'Guess GPT is a AI Vision App that helps you identify Places / People / Things in an Image.',
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'


export default async function Page() {
  return <Chat/>
}
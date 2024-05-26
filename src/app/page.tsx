import { Metadata } from "next"
import Chat from "./client"

export const metadata: Metadata = {
  title: 'Guess GPT : Guess what\'s in the image',
  description: 'Guess GPT is a AI Vision App that helps you identify Places / People / Things in an Image.',
}


export default async function Page() {
  return <Chat/>
}
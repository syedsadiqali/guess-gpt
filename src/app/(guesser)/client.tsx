"use client";

import { type CoreMessage } from "ai";
import { useState } from "react";
import { continueConversation } from "../actions/openai";
import { readStreamableValue } from "ai/rsc";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import FileUploader from "./_components/file-uploader";
import InputWithPreview from "./_components/input-with-preview";
import { Skeleton } from "@/components/ui/skeleton";

type GuessState = "not-started" | "image-uploaded" | "started" | "done";

export default function Chat() {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [input, setInput] = useState("");

  const [guessState, setGuessState] = useState<GuessState>("not-started");
  const [error, setError] = useState<string | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const onRemovePreviewImage = () => {
    setImageUrl(null);
    setGuessState("not-started");
  };

  const onSubmit = async () => {
    
    if (guessState === "done") {
      setGuessState("not-started");
      setImageUrl(null);
      setMessages([]);
      setIsLoading(false);
      return;
    }

    setGuessState("started");

    setIsLoading(true);

    setInput("");

    const result = await continueConversation({
      input,
      imageUrl: imageUrl as string,
    });

    //@ts-ignore
    if (result?.error) {
      //@ts-ignore
      setError(result?.error);
      setIsLoading(false);
      setImageUrl(null);
      return;
    }

    if (!result) {
      return;
    }

    for await (const content of readStreamableValue(result)) {
      setMessages([
        {
          role: "assistant",
          content: content as string,
        },
      ]);
    }

    setIsLoading(false);

    setGuessState("done");
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <form
        onSubmit={async (e: any) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="flex flex-col w-full max-w-md p-2 mb-8 rounded">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
            Guess GPT
          </h1>
          <div className="text-lg font-semibold text-muted-foreground">
            Attach an Image to start, This can help you Identify Famous Places
            and Things in an image.
          </div>

          {guessState === "not-started" ? (
            <div className="pt-2 pb-4">
              <FileUploader
                onFileUploadSuccess={(files: any) => {
                  if (files[0]?.url) {
                    setGuessState("image-uploaded");
                    setImageUrl(files[0]?.url);
                  }
                }}
              />
            </div>
          ) : (
            <div className="pt-2">
              <InputWithPreview
                guessState={guessState}
                imageUrl={imageUrl as string}
                input={input}
                setInput={setInput}
                onRemovePreviewImage={onRemovePreviewImage}
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !imageUrl}
            className="bg-gradient-to-tr from-orange-200 via-violet-600 to-orange-900bg-gradient-to-r from-fuchsia-600 to-purple-600 dark:text-white dark:font-bold"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {guessState === "done" ? `Reset` : `Guess What ?`}
          </Button>

          {!messages?.length && guessState === "started" && !error ? (
           <div className="space-y-2 mt-4">
           <Skeleton className="h-8 w-full" />
           <Skeleton className="h-8 w-full" />
           <Skeleton className="h-8 w-full" />
           <Skeleton className="h-8 w-full" />
           <Skeleton className="h-8 w-full" />
           <Skeleton className="h-8 w-full" />
         </div>
          ) : (
            <div className="mt-4 py-2">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className="text-lg text-muted-foreground whitespace-pre-wrap"
                >
                  {m.content as string}
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

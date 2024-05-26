"use client";

import { type CoreMessage } from "ai";
import { useState } from "react";
import { continueConversation } from "./actions";
import { readStreamableValue } from "ai/rsc";
import FileUploader from "@/components/file-uploader";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import UploadImagePreview from "@/components/upload-image-preview";
import { Input } from "@/components/ui/input";
import { Metadata } from "next";

// {
//   content:
//     "How are you \n I am doing great \n \n and this is great things ow are you \n I am doing great \n \n and this is great things ow are you \n I am doing great \n \n and this is great things ",
//   role: "assistant",
// },


export default function Chat() {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [input, setInput] = useState("");

  const [guessState, setGuessState] = useState<string>("not-started");
  const [error, setError] = useState<string | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleUploadImageFile = async (file: File) => {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

    // let img = await getImageDimensions(base64);

    // img.w > 1000 || img.h > 1000 ? setImageUrl(base64) : console.log("sorry");
    setImageUrl(base64);
  };

  const handleUploadFile = async (file: File) => {
    try {
      if (file.type.startsWith("image/")) {
        return await handleUploadImageFile(file);
      }
      // props.onFileUpload?.(file);
    } catch (error: any) {
      // props.onFileError?.(error.message);
    }
  };

  const onRemovePreviewImage = () => setImageUrl(null);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <form
        onSubmit={async (e: any) => {
          e.preventDefault();

          if (guessState === "done") {
            setGuessState("not-started");
            setImageUrl(null);
            setMessages([]);
            setIsLoading(false);
            return;
          }

          setGuessState("started");

          setIsLoading(true);

          const newMessages: CoreMessage[] = [
            {
              content: [
                {
                  type: "text",
                  text: input,
                },
				// @ts-ignore
                { type: "image", image: imageUrl?.split(",")[1] },
              ],
              role: "user",
            },
          ];

          setInput("");

          const result = await continueConversation(newMessages);
          
          //@ts-ignore
          if (result?.error) {
            //@ts-ignore
            setError(result?.error);
            setIsLoading(false)
            setImageUrl(null)
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
        }}
      >
        <div className="flex flex-col w-full max-w-md p-2 mb-8 rounded">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
            Guess GPT
          </h1>
		  <div className="text-lg font-semibold text-muted-foreground">Attach and Image to start, This can help you Identify Famous Places and Things in an image.</div>
          {imageUrl ? (
            <div className="flex flex-col max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl">
              {imageUrl ? (
                <UploadImagePreview
                  url={imageUrl}
                  allowPreviewRemove={guessState === "not-started"}
                  onRemove={onRemovePreviewImage}
                />
              ) : (
                <></>
              )}
              <div className="flex justify-center items-center pr-2 mt-2 border border-gray-300 rounded shadow-xl">
                <input
                  className="w-full p-2"
                  value={input}
                  placeholder="Add a hint if you have any ..."
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={100}
                />
                <FileUploader
                  onFileUpload={handleUploadFile}
                  // onFileError={props.onFileError}
                  config={{
                    allowedExtensions: ["jpg", "jpeg", "png", "webp"],
                    disabled: !!imageUrl,
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center pr-2 mt-2 border border-gray-300 rounded shadow-xl mb-4">
              <Input
                className="w-full p-2 focus-visible:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-0"
                value={input}
                placeholder="Add a hint if you have any ..."
                onChange={(e) => setInput(e.target.value)}
                maxLength={100}
              />
              <FileUploader
                onFileUpload={handleUploadFile}
                // onFileError={props.onFileError}
                config={{
                  allowedExtensions: ["jpg", "jpeg", "png", "webp"],
                  disabled: !!imageUrl,
                }}
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !imageUrl}
            className="bg-gradient-to-tr from-orange-200 via-violet-600 to-orange-900bg-gradient-to-r from-fuchsia-600 to-purple-600"
            // onClick={() => setIsLoading(true)}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {guessState === "done" ? `Reset` : `Guess What ?`}
          </Button>

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

"use server";

import { createStreamableValue } from "ai/rsc";
import { CoreMessage, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { headers } from "next/headers";
import { Redis } from "@upstash/redis";
import { SYSTEM_PROMPT } from "@/lib/constants";
import { ratelimit } from "@/lib/rate-limit";

export async function getIp() {
  const FALLBACK_IP_ADDRESS = "0.0.0.0";
  const forwardedFor = headers().get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS;
  }

  return headers().get("x-real-ip") ?? FALLBACK_IP_ADDRESS;
}

export async function getHost() {
  let domain = headers().get("host") as string;
  // remove www. from domain and convert to lowercase
  domain = domain.replace("www.", "").toLowerCase();

  if (domain === "localhost:3000") {
    return "localhost";
  } else {
    return domain;
  }
}

export async function continueConversation({
  imageUrl,
  input,
}: {
  imageUrl: string;
  input: string;
}) {
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    const ip = await getIp();
    const host = await getHost();

    if (host !== "localhost") {
      const { success, limit, reset, remaining } = await ratelimit(5, "1 h").limit(
        `ratelimit_${ip}`
      );

      if (!success) {
        return {
          error:
            "You have reached your request limit for the hour. Try again in 1 hour.",
        };
      }
    }
    const newMessages: CoreMessage[] = [
      {
        content: [
          {
            type: "text",
            text: input,
          },
          { type: "image", image: new URL(imageUrl as string) },
        ],
        role: "user",
      },
    ];

    const result = await streamText({
      model: openai("gpt-4o"),
      system: SYSTEM_PROMPT,
      messages: newMessages,
    });

    const stream = createStreamableValue(result.textStream);
    return stream.value;
  }
}

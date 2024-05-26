"use server";

import { createStreamableValue } from "ai/rsc";
import { CoreMessage, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { headers } from "next/headers";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { SYSTEM_PROMPT } from "@/lib/constants";

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

export async function continueConversation(messages: CoreMessage[]) {
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    const ip = await getIp();
    const host = await getHost();

    if (host !== "localhost") {
      const ratelimit = new Ratelimit({
        redis: Redis.fromEnv(),
        // rate limit to 5 requests per hour
        limiter: Ratelimit.slidingWindow(5, "1h"),
      });

      const { success, limit, reset, remaining } = await ratelimit.limit(
        `ratelimit_${ip}`
      );

      if (!success) {
        return {
          error:
            "You have reached your request limit for the hour. Try again in 1 hour.",
        };
      }
    }
  }

  const result = await streamText({
    model: openai("gpt-4o"),
    system: SYSTEM_PROMPT,
    messages,
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
}

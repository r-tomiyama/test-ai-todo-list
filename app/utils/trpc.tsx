"use client";

import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import superjson from "superjson";
import type { AppRouter } from "../server/routers/_app";

// tRPCクライアントを作成
export const trpc = createTRPCReact<AppRouter>();

// tRPCのAPI設定
export const trpcConfig = {
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
    }),
  ],
};

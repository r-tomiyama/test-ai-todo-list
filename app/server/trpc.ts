import { initTRPC } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import superjson from "superjson";
import { PrismaClient } from "../__generated__/prisma";
import { PrismaClient as PrismaClientForEdge } from "../__generated__/prisma/edge";

import { withAccelerate } from "@prisma/extension-accelerate";

const isEdge = process.env["NEXT_RUNTIME"] === "edge";

const prisma = isEdge
  ? new PrismaClientForEdge().$extends(withAccelerate())
  : new PrismaClient();

/**
 * tRPCコンテキストの型定義
 */
export type TRPCContext = {
  prisma: PrismaClient;
};

/**
 * tRPCコンテキストの作成
 */
export const createTRPCContext = async (
  opts: FetchCreateContextFnOptions
): Promise<TRPCContext> => {
  return {
    prisma,
  } as any; // TODO
};

/**
 * tRPCインスタンスの初期化
 */
const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

/**
 * tRPCルーター作成のためのヘルパー
 */
export const router = t.router;

/**
 * プロシージャの作成（公開APIエンドポイント）
 */
export const publicProcedure = t.procedure;

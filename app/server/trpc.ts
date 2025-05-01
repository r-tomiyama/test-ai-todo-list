import { initTRPC } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import superjson from "superjson";
import { PrismaClient } from "../__generated__/prisma";

// Prismaクライアントのグローバルインスタンスを作成
const prisma = new PrismaClient();

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
  };
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

// filepath: /Users/peko/git-repo/test-ai-todo-list/app/server/routers/project.ts
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

// プロジェクトの入力バリデーション用スキーマ
const projectInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

// プロジェクトの更新バリデーション用スキーマ
const projectUpdateSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

export const projectRouter = router({
  // 全プロジェクトの取得
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  // プロジェクトとそれに関連するタスクを取得
  getAllWithTodos: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.project.findMany({
      include: {
        todos: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  // 単一プロジェクトの取得
  getById: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return await ctx.prisma.project.findUnique({
      where: { id: input },
      include: { todos: true },
    });
  }),

  // プロジェクトの作成
  create: publicProcedure
    .input(projectInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.project.create({
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),

  // プロジェクトの更新
  update: publicProcedure
    .input(projectUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.prisma.project.update({
        where: { id },
        data,
      });
    }),

  // プロジェクトの削除
  delete: publicProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.project.delete({
      where: { id: input },
    });
  }),
});

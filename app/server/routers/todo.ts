import { z } from "zod";
import { publicProcedure, router } from "../trpc";

// Todoの入力バリデーション用スキーマ
const todoInputSchema = z.object({
  title: z.string().min(1),
});

// Todoの更新バリデーション用スキーマ
const todoUpdateSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  completed: z.boolean().optional(),
});

export const todoRouter = router({
  // 全Todoの取得
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.todo.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  // 単一Todoの取得
  getById: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return await ctx.prisma.todo.findUnique({
      where: { id: input },
    });
  }),

  // Todoの作成
  create: publicProcedure
    .input(todoInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.todo.create({
        data: {
          title: input.title,
        },
      });
    }),

  // Todoの更新
  update: publicProcedure
    .input(todoUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.prisma.todo.update({
        where: { id },
        data,
      });
    }),

  // Todoの削除
  delete: publicProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.todo.delete({
      where: { id: input },
    });
  }),

  // Todoの完了状態の切り替え
  toggle: publicProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    const todo = await ctx.prisma.todo.findUnique({
      where: { id: input },
    });

    if (!todo) throw new Error("Todo not found");

    return await ctx.prisma.todo.update({
      where: { id: input },
      data: { completed: !todo.completed },
    });
  }),
});

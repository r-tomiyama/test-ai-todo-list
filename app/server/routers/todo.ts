import { z } from "zod";
import { publicProcedure, router } from "../trpc";

// Todoの入力バリデーション用スキーマ
const todoInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().optional(), // 日付文字列として受け取る
  projectId: z.number().optional(), // プロジェクトID
});

// Todoの更新バリデーション用スキーマ
const todoUpdateSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  completed: z.boolean().optional(),
  projectId: z.number().optional(), // プロジェクトID
});

export const todoRouter = router({
  // 全Todoの取得
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.todo.findMany({
      include: { project: true },
      orderBy: { createdAt: "desc" },
    });
  }),

  // プロジェクトに紐づくTodoの取得
  getByProject: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.todo.findMany({
        where: { projectId: input },
        orderBy: { createdAt: "desc" },
      });
    }),

  // 未分類のTodo（プロジェクトに紐付いていないもの）の取得
  getUnassigned: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.todo.findMany({
      where: { projectId: null },
      orderBy: { createdAt: "desc" },
    });
  }),

  // 単一Todoの取得
  getById: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return await ctx.prisma.todo.findUnique({
      where: { id: input },
      include: { project: true },
    });
  }),

  // Todoの作成
  create: publicProcedure
    .input(todoInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.todo.create({
        data: {
          title: input.title,
          description: input.description,
          // 文字列として受け取った日付をDate型に変換
          dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
          projectId: input.projectId,
        },
      });
    }),

  // Todoの更新
  update: publicProcedure
    .input(todoUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, dueDate, ...data } = input;
      return await ctx.prisma.todo.update({
        where: { id },
        data: {
          ...data,
          // 文字列として受け取った日付をDate型に変換
          dueDate: dueDate ? new Date(dueDate) : undefined,
        },
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

  // Todoをプロジェクトに割り当て
  assignToProject: publicProcedure
    .input(
      z.object({
        todoId: z.number(),
        projectId: z.number().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.todo.update({
        where: { id: input.todoId },
        data: { projectId: input.projectId },
      });
    }),
});

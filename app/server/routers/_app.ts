import { router } from "../trpc";
import { todoRouter } from "./todo";

// メインルーターの作成
export const appRouter = router({
  todo: todoRouter,
});

// appRouterの型をエクスポート
export type AppRouter = typeof appRouter;

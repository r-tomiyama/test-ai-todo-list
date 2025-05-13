import { router } from "../trpc";
import { projectRouter } from "./project";
import { todoRouter } from "./todo";

// メインルーターの作成
export const appRouter = router({
  todo: todoRouter,
  project: projectRouter,
});

// appRouterの型をエクスポート
export type AppRouter = typeof appRouter;

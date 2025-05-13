import { router } from "../trpc";
import { todoRouter } from "./todo";
import { projectRouter } from "./project";

// メインルーターの作成
export const appRouter = router({
  todo: todoRouter,
  project: projectRouter,
});

// appRouterの型をエクスポート
export type AppRouter = typeof appRouter;

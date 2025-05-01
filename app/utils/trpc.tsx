import { createTRPCReact } from '@trpc/react-query';
import { AppRouter } from '../server/routers/_app';

// tRPCクライアントを作成
export const trpc = createTRPCReact<AppRouter>();

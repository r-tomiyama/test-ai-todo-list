'use client';

import { trpc } from '../utils/trpc';
import { Todo } from '@prisma/client';

export const useTodos = () => {
  // Todoリストの取得
  const { data: todos, isLoading, refetch } = trpc.todo.getAll.useQuery();
  
  // Todo作成のミューテーション
  const createTodoMutation = trpc.todo.create.useMutation({
    onSuccess: () => refetch(),
  });
  
  // Todo更新のミューテーション
  const updateTodoMutation = trpc.todo.update.useMutation({
    onSuccess: () => refetch(),
  });
  
  // Todo削除のミューテーション
  const deleteTodoMutation = trpc.todo.delete.useMutation({
    onSuccess: () => refetch(),
  });
  
  // Todo完了状態切り替えのミューテーション
  const toggleTodoMutation = trpc.todo.toggle.useMutation({
    onSuccess: () => refetch(),
  });

  // Todo作成関数
  const createTodo = async (title: string) => {
    await createTodoMutation.mutateAsync({ title });
  };
  
  // Todo更新関数
  const updateTodo = async (id: number, title: string) => {
    await updateTodoMutation.mutateAsync({ id, title });
  };
  
  // Todo削除関数
  const deleteTodo = async (id: number) => {
    await deleteTodoMutation.mutateAsync(id);
  };
  
  // Todo完了状態切り替え関数
  const toggleTodo = async (id: number) => {
    await toggleTodoMutation.mutateAsync(id);
  };

  return {
    todos,
    isLoading,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    isCreating: createTodoMutation.isPending,
    isUpdating: updateTodoMutation.isPending,
    isDeleting: deleteTodoMutation.isPending,
    isToggling: toggleTodoMutation.isPending,
  };
};

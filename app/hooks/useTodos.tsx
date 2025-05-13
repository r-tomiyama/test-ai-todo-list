"use client";

import { useState } from "react";
import { trpc } from "../utils/trpc";

export const useTodos = (projectId?: number) => {
  const utils = trpc.useContext();
  
  // 特定のプロジェクトのTodoを取得するか、プロジェクトIDがない場合は全てのTodoを取得
  const { 
    data: todos, 
    isLoading,
  } = projectId !== undefined
    ? trpc.todo.getByProject.useQuery(projectId)
    : trpc.todo.getAll.useQuery();

  // Todo作成のミューテーション
  const createTodoMutation = trpc.todo.create.useMutation({
    onSuccess: () => {
      utils.todo.getAll.invalidate();
      utils.todo.getByProject.invalidate();
      utils.project.getAllWithTodos.invalidate();
    },
  });

  // Todo更新のミューテーション
  const updateTodoMutation = trpc.todo.update.useMutation({
    onSuccess: () => {
      utils.todo.getAll.invalidate();
      utils.todo.getByProject.invalidate();
      utils.project.getAllWithTodos.invalidate();
    },
  });

  // Todo削除のミューテーション
  const deleteTodoMutation = trpc.todo.delete.useMutation({
    onSuccess: () => {
      utils.todo.getAll.invalidate();
      utils.todo.getByProject.invalidate();
      utils.project.getAllWithTodos.invalidate();
    },
  });

  // Todo完了状態切り替えのミューテーション
  const toggleTodoMutation = trpc.todo.toggle.useMutation({
    onSuccess: () => {
      utils.todo.getAll.invalidate();
      utils.todo.getByProject.invalidate();
      utils.project.getAllWithTodos.invalidate();
    },
  });

  // Todo作成関数
  const createTodo = async (
    title: string,
    description?: string,
    dueDate?: string,
    projectId?: number
  ) => {
    await createTodoMutation.mutateAsync({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      projectId,
    });
  };

  // Todo更新関数
  const updateTodo = async (
    id: number,
    updates: {
      title?: string;
      description?: string;
      dueDate?: Date;
      completed?: boolean;
      projectId?: number;
    }
  ) => {
    await updateTodoMutation.mutateAsync({
      id,
      ...updates,
      dueDate: updates.dueDate ? updates.dueDate.toISOString() : undefined,
    });
  };

  // Todo削除関数
  const deleteTodo = async (id: number) => {
    await deleteTodoMutation.mutateAsync(id);
  };

  // Todo完了状態切り替え関数
  const toggleTodo = async (id: number) => {
    await toggleTodoMutation.mutateAsync(id);
  };

  // プロジェクト割り当て関数
  const assignToProject = async (todoId: number, projectId: number | null) => {
    await updateTodoMutation.mutateAsync({
      id: todoId,
      projectId: projectId || undefined,
    });
  };

  return {
    todos,
    isLoading,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    assignToProject,
    isCreating: createTodoMutation.isPending,
    isUpdating: updateTodoMutation.isPending,
    isDeleting: deleteTodoMutation.isPending,
    isToggling: toggleTodoMutation.isPending,
  };
};

// filepath: /Users/peko/git-repo/test-ai-todo-list/app/hooks/useProjects.tsx
"use client";

import { useState } from "react";
import { Project, type ProjectFormData } from "../types/todo";
import { trpc } from "../utils/trpc";

export function useProjects() {
  const utils = trpc.useContext();

  // プロジェクト一覧を取得
  const { data: projects = [], isLoading } = trpc.project.getAll.useQuery(
    undefined,
    {
      // エラーハンドリングはコンポーネント内で行う
    }
  );

  // プロジェクト作成
  const createMutation = trpc.project.create.useMutation({
    onSuccess: async () => {
      await utils.project.getAll.invalidate();
      await utils.project.getAllWithTodos.invalidate();
    },
  });

  // プロジェクト更新
  const updateMutation = trpc.project.update.useMutation({
    onSuccess: async () => {
      await utils.project.getAll.invalidate();
      await utils.project.getAllWithTodos.invalidate();
    },
  });

  // プロジェクト削除
  const deleteMutation = trpc.project.delete.useMutation({
    onSuccess: async () => {
      await utils.project.getAll.invalidate();
      await utils.project.getAllWithTodos.invalidate();
      await utils.todo.getAll.invalidate();
    },
  });

  // プロジェクトの作成
  const createProject = async (data: ProjectFormData) => {
    try {
      await createMutation.mutateAsync(data);
      return true;
    } catch (error) {
      console.error("Failed to create project:", error);
      return false;
    }
  };

  // プロジェクトの更新
  const updateProject = async (
    data: { id: number } & Partial<ProjectFormData>
  ) => {
    try {
      await updateMutation.mutateAsync(data);
      return true;
    } catch (error) {
      console.error("Failed to update project:", error);
      return false;
    }
  };

  // プロジェクトの削除
  const deleteProject = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      return true;
    } catch (error) {
      console.error("Failed to delete project:", error);
      return false;
    }
  };

  return {
    projects,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

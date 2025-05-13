// filepath: /Users/peko/git-repo/test-ai-todo-list/app/components/ProjectList.tsx
"use client";

import { useState } from "react";
import { useProjects } from "../hooks/useProjects";
import { Project, ProjectFormData } from "../types/todo";
import ProjectForm from "./ProjectForm";
import TextButton from "./TextButton";
import Button from "./Button";

export default function ProjectList() {
  const { projects, isLoading, createProject, updateProject, deleteProject } = useProjects();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleCreateProject = async (data: ProjectFormData) => {
    await createProject(data);
    setShowAddForm(false);
  };

  const handleUpdateProject = async (data: ProjectFormData) => {
    if (editingProject) {
      await updateProject({
        id: editingProject.id,
        ...data,
      });
      setEditingProject(null);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (confirm("このプロジェクトを削除してもよろしいですか？関連するタスクはプロジェクト未割り当てになります。")) {
      await deleteProject(id);
    }
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setShowAddForm(false);
  };

  if (isLoading) return <div>プロジェクトを読み込み中...</div>;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">プロジェクト</h2>
        <Button 
          variant="primary"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingProject(null);
          }}
        >
          {showAddForm ? "キャンセル" : "新規プロジェクト"}
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-3">新規プロジェクト</h3>
          <ProjectForm onSubmit={handleCreateProject} />
        </div>
      )}

      {editingProject && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-3">プロジェクトを編集</h3>
          <ProjectForm
            defaultValues={{
              name: editingProject.name,
              description: editingProject.description || "",
            }}
            onSubmit={handleUpdateProject}
            onCancel={() => setEditingProject(null)}
          />
        </div>
      )}

      <div className="space-y-4">
        {projects.length === 0 ? (
          <p className="text-gray-500">プロジェクトがありません</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{project.name}</h3>
                  {project.description && (
                    <p className="text-gray-600 mt-1">{project.description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <TextButton
                    onClick={() => handleEditClick(project)}
                    color="primary"
                  >
                    編集
                  </TextButton>
                  <TextButton
                    onClick={() => handleDeleteProject(project.id)}
                    color="delete"
                  >
                    削除
                  </TextButton>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

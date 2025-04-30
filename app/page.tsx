"use client";

import { useState } from "react";
import { useTodos } from "./hooks/useTodos";

export default function Home() {
  const [newTodo, setNewTodo] = useState("");
  const { todos, isLoading, isError, createTodo, updateTodo, deleteTodo } = useTodos();

  // Add a new todo
  function addTodo() {
    if (!newTodo.trim()) return;
    createTodo(newTodo);
    setNewTodo("");
  }

  // Toggle todo completion
  function toggleTodoCompletion(id: string, completed: boolean) {
    updateTodo({ id, completed: !completed });
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">TODO List</h1>

      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-500">Error loading todos</p>}

      <div className="mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="border p-2 mr-2"
        />
        <button onClick={addTodo} className="bg-blue-500 text-white px-4 py-2">
          Add
        </button>
      </div>

      {!isLoading && (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodoCompletion(todo.id, todo.completed)}
                className="mr-2"
              />
              <span className={todo.completed ? "line-through" : ""}>{todo.title}</span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="ml-auto bg-red-500 text-white px-2 py-1"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { mockProjects, mockTasks } from "@/lib/mockData";

type TaskStatus = "todo" | "in_progress" | "done";

type ProjectOption = {
  id: string;
  name: string;
};

interface Task {
  id: string;
  title: string;
  project: string;
  projectId: string;
  dueDate?: string;
  tags: { label: string; color: string }[];
}

const allMockTasks = Object.values(mockTasks);

const initialTasks: Record<TaskStatus, Task[]> = {
  todo: allMockTasks
    .filter((t) => t.status === "todo")
    .map((t) => ({
      id: t.id,
      title: t.title,
      project: t.project.name,
      projectId: t.project.id,
      dueDate: t.dueDate,
      tags: t.tags,
    })),
  in_progress: allMockTasks
    .filter((t) => t.status === "in_progress")
    .map((t) => ({
      id: t.id,
      title: t.title,
      project: t.project.name,
      projectId: t.project.id,
      dueDate: t.dueDate,
      tags: t.tags,
    })),
  done: allMockTasks
    .filter((t) => t.status === "done")
    .map((t) => ({
      id: t.id,
      title: t.title,
      project: t.project.name,
      projectId: t.project.id,
      dueDate: t.dueDate,
      tags: t.tags,
    })),
};

const columns: { key: TaskStatus; label: string }[] = [
  { key: "todo", label: "Todo" },
  { key: "in_progress", label: "In Progress" },
  { key: "done", label: "Done" },
];

const colAccent: Record<TaskStatus, string> = {
  todo: "bg-slate-100 text-slate-500",
  in_progress: "bg-blue-50 text-blue-600",
  done: "bg-green-50 text-green-700",
};

const STORAGE_KEY = "collabpm-tasks";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Record<TaskStatus, Task[]>>(() => {
    if (typeof window === "undefined") return initialTasks;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialTasks;

    try {
      const parsed = JSON.parse(stored) as Record<TaskStatus, Task[]>;
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    } catch (error) {
      console.warn("Failed to parse stored tasks", error);
    }
    return initialTasks;
  });
  const [dragging, setDragging] = useState<{
    task: Task;
    from: TaskStatus;
  } | null>(null);
  const [dragOver, setDragOver] = useState<TaskStatus | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState(Object.values(mockProjects)[0]?.id || "");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");

  const projectOptions = useMemo<ProjectOption[]>(
    () => Object.values(mockProjects).map((project) => ({ id: project.id, name: project.name })),
    [],
  );

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  function onDragStart(task: Task, from: TaskStatus) {
    setDragging({ task, from });
  }

  function onDrop(to: TaskStatus) {
    if (!dragging || dragging.from === to) {
      setDragging(null);
      setDragOver(null);
      return;
    }
    setTasks((prev) => ({
      ...prev,
      [dragging.from]: prev[dragging.from].filter((t) => t.id !== dragging.task.id),
      [to]: [...prev[to], { ...dragging.task }],
    }));
    setDragging(null);
    setDragOver(null);
  }

  function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !projectId) return;

    const project = projectOptions.find((p) => p.id === projectId);
    const nextTask: Task = {
      id: `t${Date.now()}`,
      title: title.trim(),
      project: project?.name ?? "Unknown project",
      projectId,
      dueDate: dueDate || undefined,
      tags: [{ label: status === "done" ? "Done" : status === "in_progress" ? "In Progress" : "Todo", color: status === "done" ? "bg-green-50 text-green-700" : status === "in_progress" ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500" }],
    };

    setTasks((prev) => ({
      ...prev,
      [status]: [nextTask, ...prev[status]],
    }));
    setTitle("");
    setDueDate("");
    setStatus("todo");
    setProjectId(projectOptions[0]?.id || "");
    setShowCreate(false);
  }

  return (
    <main className="flex-1 p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-2">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">My Tasks</h1>
          <p className="text-sm text-slate-500 mt-1">
            Tasks assigned to you across all projects
          </p>
        </div>
        <Button
          onClick={() => setShowCreate((prev) => !prev)}
          className="text-sm font-medium rounded-lg"
        >
          {showCreate ? 'Cancel' : '+ New task'}
        </Button>
      </div>

      {showCreate && (
        <section className="mb-6 rounded-[18px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Add a new task</h2>
          <form onSubmit={handleCreateTask} className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col text-sm text-slate-700">
              Task title
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                placeholder="Task name"
              />
            </label>
            <label className="flex flex-col text-sm text-slate-700">
              Project
              <select
                value={projectId}
                onChange={(event) => setProjectId(event.target.value)}
                className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              >
                {projectOptions.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col text-sm text-slate-700">
              Due date
              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="flex flex-col text-sm text-slate-700">
              Status
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as TaskStatus)}
                className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </label>
            <div className="md:col-span-2 text-right">
              <Button type="submit" className="rounded-lg">
                Create task
              </Button>
            </div>
          </form>
        </section>
      )}

      {/* Info note */}
      <p className="text-xs text-slate-400 mb-6">
        Drag tasks between columns to update status — changes sync to the project board automatically.
      </p>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(({ key, label }) => (
          <div
            key={key}
            className="rounded-xl p-3 transition-colors"
            style={{
              background: dragOver === key ? "#eff6ff" : "#f4f4f6",
              border:
                dragOver === key
                  ? "0.5px solid #93c5fd"
                  : "0.5px solid #e4e4e7",
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(key);
            }}
            onDragLeave={() => setDragOver(null)}
            onDrop={() => onDrop(key)}
          >
            {/* Column header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {label}
              </span>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${colAccent[key]}`}>
                {tasks[key].length}
              </span>
            </div>

            {/* Task cards */}
            <div className="flex flex-col gap-2 min-h-20">
              {tasks[key].map((task) => (
                <Link
                  key={task.id}
                  href={`/tasks/${task.id}`}
                  draggable
                  onDragStart={(e) => {
                    e.stopPropagation();
                    onDragStart(task, key);
                  }}
                  className="block bg-white rounded-[10px] p-3 cursor-grab active:cursor-grabbing select-none hover:border-blue-200 transition-colors"
                  style={{ border: "0.5px solid #e4e4e7" }}
                  onClick={(e) => dragging && e.preventDefault()}
                >
                  <p className="text-sm font-medium text-slate-800 mb-2 leading-snug">
                    {task.title}
                  </p>

                  {/* Project name */}
                  <p className="text-[11px] text-slate-400 mb-2 truncate">
                    📁 {task.project}
                  </p>

                  <div className="flex items-center justify-between gap-2">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {task.tags.map((tag) => (
                        <span
                          key={tag.label}
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tag.color}`}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>

                    {/* Due date */}
                    {task.dueDate && (
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {task.dueDate}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <button
              className="w-full mt-2 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-600 hover:bg-white/70 transition-colors text-left px-2"
              onClick={() => {
                setShowCreate(true);
                setStatus(key);
              }}
            >
              + Add task
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

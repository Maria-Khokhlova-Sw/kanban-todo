"use client";

import "./section.css";
import { createContext, useContext, useEffect, useState } from "react";

const jobs = ["В работе", "В планах", "На тестировании", "Сделано"] as const;

type Task = { id: string; text: string };


type TasksState = {
  [key: string]: Task[];
};

type TasksContextType = {
  tasks: TasksState;
  addTask: (column: string, text: string) => void;
  deleteTask: (column: string, id: string) => void;
};

const TasksContext = createContext<TasksContextType | undefined>(undefined);

function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<TasksState>(
      jobs.reduce((acc, job) => ({ ...acc, [job]: [] }), {})
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const initialState: TasksState = {};
    try {
      jobs.forEach((job) => {
        const key = `tasks:${job}`;
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.every((x) => typeof x === "object" && "id" in x && "text" in x)) {
            initialState[job] = parsed;
          } else {
            initialState[job] = [];
          }
        } else {
          initialState[job] = [];
        }
      });
      setTasks(initialState);
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error);
      setTasks(jobs.reduce((acc, job) => ({ ...acc, [job]: [] }), {}));
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;
    try {
      Object.entries(tasks).forEach(([column, tasks]) => {
        const key = `tasks:${column}`;
        console.log(`Saving tasks for ${key}:`, tasks);
        localStorage.setItem(key, JSON.stringify(tasks));
      });
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error);
    }
  }, [tasks]);

  const addTask = (column: string, text: string) => {
    setTasks((prev) => ({
      ...prev,
      [column]: [...(prev[column] || []), { id: crypto.randomUUID(), text }],
    }));
  };

  const deleteTask = (column: string, id: string) => {
    setTasks((prev) => ({
      ...prev,
      [column]: prev[column].filter((task) => task.id !== id),
    }));
  };

  return (
      <TasksContext.Provider value={{ tasks, addTask, deleteTask }}>
        {children}
      </TasksContext.Provider>
  );
}

function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
}

export default function Section() {
  return (
      <TasksProvider>
        <>
          {jobs.map((job) => (
              <Column key={job} title={job} />
          ))}
        </>
      </TasksProvider>
  );
}

function Column({ title }: { title: string }) {
  const { tasks, addTask, deleteTask } = useTasks();
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState("");

  const startAdding = () => setAdding(true);

  const submitTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newValue = value.trim();
    if (!newValue) return;
    addTask(title, newValue);
    setValue("");
    setAdding(false);
  };

  const cancel = () => {
    setAdding(false);
    setValue("");
  };

  return (
      <div className="section">
        <input type="text" placeholder="Название колонки" className="section-header" defaultValue={title} aria-label={`Column title: ${title}`}/>
        <ul className="tasks">
          {tasks[title]?.map((task) => (
              <li key={task.id} className="task">
                {task.text}
                <button className="delete-button" onClick={() => deleteTask(title, task.id)} aria-label={`Delete task: ${task.text}`}>Удалить</button>
              </li>
          ))}
          {adding && (
              <li className="task task--new">
                <form onSubmit={submitTask} aria-label={`Add task to ${title}`}>
                  <input autoFocus value={value} onChange={(e) => setValue(e.target.value)} placeholder="Введите задачу"/>
                  <div className="task-buttons">
                    <button type="submit" disabled={!value.trim()}>Ок</button>
                    <button type="button" onClick={cancel}>Отмена</button>
                  </div>
                </form>
              </li>
          )}
        </ul>

        <button className="section-button" onClick={startAdding}>
          Добавить задачу
        </button>
      </div>
  );
}

"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { COLUMNS, type Tasks, type TasksContextType } from "../lib/types"

const TasksContext = createContext<TasksContextType | undefined>(undefined)

export function TasksProvider({ children }: { children: React.ReactNode }) {
    const [tasks, setTasks] = useState<Tasks>(COLUMNS.reduce((acc, job) => ({ ...acc, [job]: [] }), {}))
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
        const saved: Tasks = {}
        COLUMNS.forEach((col) => {
            const data = localStorage.getItem(`tasks:${col}`)
            saved[col] = data ? JSON.parse(data) : []
        })
        setTasks(saved)
    }, [])

    useEffect(() => {
        if (!isClient) return
        COLUMNS.forEach((col) => {
            localStorage.setItem(`tasks:${col}`, JSON.stringify(tasks[col] || []))
        })
    }, [tasks, isClient])

    const addTask = (column: string, text: string, description?: string) => {
        setTasks((prev) => ({
            ...prev,
            [column]: [...(prev[column] || []), { id: crypto.randomUUID(), text, description, column, comments: [] }],
        }))
    }

    const editTask = (column: string, id: string, newText: string, newDescription?: string, newColumn?: string) => {
        setTasks((prev) => {
            if (!prev[column]) return prev

            if (newColumn && newColumn !== column) {
                const taskToMove = prev[column].find((task) => task.id === id)
                if (!taskToMove) return prev

                return {
                    ...prev,
                    [column]: prev[column].filter((task) => task.id !== id),
                    [newColumn]: [
                        ...(prev[newColumn] || []),
                        {
                            ...taskToMove,
                            text: newText,
                            description: newDescription,
                            column: newColumn,
                        },
                    ],
                }
            }
            return {
                ...prev,
                [column]: prev[column].map((task) =>
                    task.id === id ? { ...task, text: newText, description: newDescription, column } : task,
                ),
            }
        })
    }

    const deleteTask = (column: string, id: string) => {
        setTasks((prev) => {
            if (!prev[column]) return prev

            return {
                ...prev,
                [column]: prev[column].filter((task) => task.id !== id),
            }
        })
    }

    const addComment = (column: string, id: string, commentText: string, author: string) => {
        setTasks((prev) => {
            if (!prev[column]) return prev

            return {
                ...prev,
                [column]: prev[column].map((task) =>
                    task.id === id
                        ? {
                            ...task,
                            comments: [
                                ...(task.comments || []),
                                {
                                    id: crypto.randomUUID(),
                                    text: commentText,
                                    author,
                                    timestamp: Date.now(),
                                },
                            ],
                        }
                        : task,
                ),
            }
        })
    }

    return (
        <TasksContext.Provider value={{ tasks, addTask, editTask, deleteTask, addComment }}>
            {children}
        </TasksContext.Provider>
    )
}

export function useTasks() {
    const context = useContext(TasksContext)
    if (!context) {
        throw new Error("useTasks must be used within TasksProvider")
    }
    return context
}

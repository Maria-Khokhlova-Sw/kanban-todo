"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTasks } from "../../context-task/context"
import { EditTaskDialog } from "../edit-task/edit-tasks"


type ColumnProps = {
    title: string
}

export function Column({ title }: ColumnProps) {
    const { tasks, addTask, editTask, deleteTask } = useTasks()
    const [adding, setAdding] = useState(false)
    const [value, setValue] = useState("")
    const [editingTask, setEditingTask] = useState<{ taskId: string; column: string } | null>(null)

    useEffect(() => {
        if (editingTask) {
            document.body.style.overflow = "hidden"
        }else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [editingTask]);

    const startAdding = () => setAdding(true)

    const submitTask = (e: React.FormEvent) => {
        e.preventDefault()
        const newValue = value.trim()
        if (!newValue) return
        addTask(title, newValue)
        setValue("")
        setAdding(false)
    }

    const cancel = () => {
        setAdding(false)
        setValue("")
    }

    const handleEditSave = (newText: string, newDescription?: string, newColumn?: string) => {
        if (editingTask) {
            editTask(editingTask.column, editingTask.taskId, newText, newDescription, newColumn)
            setEditingTask(null)
        }
    }

    const currentTask = editingTask ? tasks[editingTask.column]?.find((t) => t.id === editingTask.taskId) || null : null

    return (
        <>
            <div className="section">
                <input type="text" placeholder="Название колонки" className="section-header" defaultValue={title} />
                <ul className="tasks">
                    {tasks[title]?.map((task) => (
                        <li key={task.id} className="task" onClick={() => setEditingTask({ taskId: task.id, column: title })}>
                            {task.text}
                            <button className="delete-button" onClick={(e) => {
                                    e.stopPropagation()
                                    deleteTask(title, task.id)
                                }}
                            >
                                +
                            </button>
                        </li>
                    ))}
                    {adding && (
                        <li className="task task--new">
                            <form onSubmit={submitTask} className="form-task">
                                <input
                                    autoFocus
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    placeholder="Введите задачу"
                                    className="input-task"
                                />
                                <div className="task-buttons">
                                    <button type="submit" disabled={!value.trim()}>
                                        Ок
                                    </button>
                                    <button type="button" onClick={() => cancel}>
                                        Отмена
                                    </button>
                                </div>
                            </form>
                        </li>
                    )}
                </ul>

                <button className="section-button" onClick={startAdding}>
                    Добавить задачу
                </button>
            </div>

            <EditTaskDialog
                task={currentTask}
                column={editingTask?.column || ""}
                onClose={() => setEditingTask(null)}
                onSave={handleEditSave}
            />
        </>
    )
}

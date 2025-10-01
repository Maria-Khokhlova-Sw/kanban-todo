"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Task } from "../../lib/types"
import "./editTasks.css"
import { useUser } from "../../../context/UserContext"
import { COLUMNS } from "../../lib/types";

type EditTaskDialogProps = {
    task: Task | null
    onClose: () => void
    onSave: (newTitle: string, newDescription: string, newColumn?: string, newComment?:string) => void
}

export function EditTaskDialog({ task, onClose, onSave }: EditTaskDialogProps) {
    const { username } = useUser()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [column, setColumn] = useState<string>("");
    const [comment, setComment] = useState("")


    useEffect(() => {
        if (task) {
            setTitle(task.text)
            setDescription(task.description ?? "")
            setColumn(task.column ?? "");
            setComment(task.comment ?? "")
        }
    }, [task])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onSave(title.trim(), description.trim() ?? undefined, column ?? undefined, comment.trim() || undefined)
            onClose();
        }
    };

    if (!task) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="menu-user">Автор изменений: {username || "User"}</div>
                <h2 className="modal-header">Редактировать задачу</h2>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="input-title">Задача</div>
                    <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Введите задачу..." className="modal-input"/>
                    <div className="input-title">Колонка</div>
                    <select value={column} onChange={(e) => setColumn(e.target.value)} className="modal-input">
                        {COLUMNS.map((col) => (
                            <option key={col} value={col}>
                                {col}
                            </option>
                        ))}
                    </select>
                    <div className="input-title">Описание задачи</div>
                    <input  value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Введите описанеие..." className="modal-input"/>
                    <div className="input-title">Комментарий к задаче</div>
                    <input  value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Введите комментарий..." className="modal-input"/>
                    <div className="modal-buttons">
                        <button type="button" onClick={onClose}>Отмена</button>
                        <button type="submit" disabled={!title.trim()}>Сохранить</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Task } from "../../lib/types"
import "./editTasks.css"
import { useUser } from "../../../context/UserContext"
import { COLUMNS } from "../../lib/types"
import { useTasks } from "../../context-task/context"

type EditTaskDialogProps = {
    task: Task | null
    column: string
    onClose: () => void
    onSave: (newTitle: string, newDescription: string, newColumn?: string) => void
}

export function EditTaskDialog({ task, column, onClose, onSave }: EditTaskDialogProps) {
    const { username } = useUser()
    const { addComment } = useTasks()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [selectedColumn, setSelectedColumn] = useState<string>("")
    const [newComment, setNewComment] = useState("")

    useEffect(() => {
        if (task) {
            setTitle(task.text)
            setDescription(task.description ?? "")
            setSelectedColumn(task.column ?? "")
            setNewComment("")
        }
    }, [task])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (title.trim()) {
            onSave(title.trim(), description.trim() ?? undefined, selectedColumn ?? undefined)
            onClose()
        }
    }

    const handleAddComment = () => {
        if (newComment.trim() && task) {
            addComment(column, task.id, newComment.trim(), username)
            setNewComment("")
        }
    }

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    if (!task) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="menu-user">Автор изменений: {username || "User"}</div>
                <h2 className="modal-header">Редактировать задачу</h2>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="input-title">Задача</div>
                    <input
                        autoFocus
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Введите задачу..."
                        className="modal-input"
                    />
                    <div className="input-title">Колонка</div>
                    <select value={selectedColumn} onChange={(e) => setSelectedColumn(e.target.value)} className="modal-input">
                        {COLUMNS.map((col) => (
                            <option key={col} value={col}>
                                {col}
                            </option>
                        ))}
                    </select>
                    <div className="input-title">Описание задачи</div>
                    <input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Введите описание..."
                        className="modal-input"
                    />

                    <div className="input-title">Комментарии</div>
                    <div className="comments-list">
                        {task.comments && task.comments.length > 0 ? (
                            task.comments.map((comment) => (
                                <div key={comment.id} className="comment-item">
                                    <div className="comment-header">
                                        <span className="comment-author">{comment.author}</span>
                                        <span className="comment-date">{formatDate(comment.timestamp)}</span>
                                    </div>
                                    <div className="comment-text">{comment.text}</div>
                                </div>
                            ))
                        ) : (
                            <div className="no-comments">Комментариев пока нет</div>
                        )}
                    </div>

                    <div className="input-title">Добавить комментарий</div>
                    <div className="comment-input-wrapper">
                        <input
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Введите комментарий..."
                            className="modal-input"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    handleAddComment()
                                }
                            }}
                        />
                        <button type="button" onClick={handleAddComment} disabled={!newComment.trim()} className="add-comment-btn">
                            Добавить
                        </button>
                    </div>

                    <div className="modal-buttons">
                        <button type="button" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" disabled={!title.trim()}>
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

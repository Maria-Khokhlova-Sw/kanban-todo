export const COLUMNS = ["В работе", "В планах", "На тестировании", "Сделано"] as const

export type Task = {
    id: string
    text: string
    description?: string
    column?: string
    comment?: string
}

export type Tasks = Record<string, Task[]>

export type TasksContextType = {
    tasks: Tasks
    addTask: (column: string, text: string, description?: string, comment?:string) => void
    editTask: (column: string, id: string, newText: string, newDescription?: string, newColumn?:string, newComment?:string) => void
    deleteTask: (column: string, id: string) => void
}

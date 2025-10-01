"use client"

import "./section.css"
import { TasksProvider } from "../context-task/context"
import { Column } from "../tasks/column/column"
import { COLUMNS } from "../lib/types"

export default function Section() {
  return (
      <TasksProvider>
        <div style={{ display: "flex", gap: "16px", padding: "24px" }}>
          {COLUMNS.map((job) => (
              <Column key={job} title={job} />
          ))}
        </div>
      </TasksProvider>
  )
}

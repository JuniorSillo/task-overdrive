import type { TaskResponse } from '../api/tasks'
import { TaskCard } from './TaskCard'

interface TaskListProps {
  tasks: TaskResponse[]
  loading: boolean
  error: string | null
  onComplete: (id: number) => void
  onDelete: (id: number) => void
}

export function TaskList({ tasks, loading, error, onComplete, onDelete }: TaskListProps) {
  if (loading) {
    return (
      <div className="state-box state-loading" role="status" aria-live="polite">
        <div className="loading-ring" aria-hidden="true" />
        <p>Loading tasks… <small>( delayed by 3 seconds)</small></p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="state-box state-error" role="alert">
        <span className="state-icon">!</span>
        <p>{error}</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="state-box state-empty">
        <p>No tasks yet. Add one to get started.</p>
      </div>
    )
  }

  return (
    <ul className="task-list" aria-label="Task list">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskCard task={task} onComplete={onComplete} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  )
}
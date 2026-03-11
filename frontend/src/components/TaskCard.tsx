import type { TaskResponse } from '../api/tasks'

interface TaskCardProps {
  task: TaskResponse
  onComplete: (id: number) => void
  onDelete: (id: number) => void
}

const PRIORITY_LABELS: Record<number, string> = {
  1: 'Low',
  2: 'Med-Low',
  3: 'Medium',
  4: 'High',
  5: 'Critical',
}

const PRIORITY_CLASSES: Record<number, string> = {
  1: 'priority-1',
  2: 'priority-2',
  3: 'priority-3',
  4: 'priority-4',
  5: 'priority-5',
}

export function TaskCard({ task, onComplete, onDelete }: TaskCardProps) {
  const createdDate = new Date(task.createdAt).toLocaleDateString('en-ZA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <article className={`task-card ${task.isCompleted ? 'task-card--done' : ''}`}>
      <div className="task-card__header">
        <span className={`priority-badge ${PRIORITY_CLASSES[task.priority]}`}>
          P{task.priority} · {PRIORITY_LABELS[task.priority]}
        </span>
        {task.isCompleted && <span className="done-badge">✓ Done</span>}
      </div>

      <h3 className="task-card__title">{task.title}</h3>

      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}

      <div className="task-card__footer">
        <time className="task-card__date" dateTime={task.createdAt}>
          {createdDate}
        </time>

        <div className="task-card__actions">
          {!task.isCompleted && (
            <button
              className="btn btn-success btn-sm"
              onClick={() => onComplete(task.id)}
              aria-label={`Mark "${task.title}" as complete`}
            >
              ✓ Complete
            </button>
          )}
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(task.id)}
            aria-label={`Delete "${task.title}"`}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}
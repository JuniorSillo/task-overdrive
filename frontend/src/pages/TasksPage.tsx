import { TaskForm } from '../components/TaskForm'
import { TaskList } from '../components/TaskList'
import { useTasks } from '../hooks/useTasks'
import type { TaskResponse } from '../api/tasks'

export function TasksPage() {
  const { tasks, loading, error, pendingCount, addTask, markComplete, removeTask } =
    useTasks()

  const handleTaskCreated = (task: TaskResponse) => {
    addTask(task)
  }

  return (
    <div className="page">
      <header className="page-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-accent"> _ </span> Task Overdrive
          </h1>
          <p className="app-subtitle">
            BitCube Trainee Project
          </p>
        </div>

       
        <div className="stats-bar">
          <div className="stat">
            <span className="stat-value">{tasks.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat stat--accent">
            <span className="stat-value">{pendingCount}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat">
            <span className="stat-value">{tasks.length - pendingCount}</span>
            <span className="stat-label">Done</span>
          </div>
        </div>
      </header>

      <main className="page-main">
        <aside className="sidebar">
          <TaskForm onTaskCreated={handleTaskCreated} />
        </aside>

        <section className="content" aria-label="Task list section">
          <div className="section-header">
            <h2 className="section-title">All Tasks</h2>
            <span className="pending-chip">
              {pendingCount} pending
            </span>
          </div>
          <TaskList
            tasks={tasks}
            loading={loading}
            error={error}
            onComplete={markComplete}
            onDelete={removeTask}
          />
        </section>
      </main>
    </div>
  )
}
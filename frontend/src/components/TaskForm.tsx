import { useState, useCallback } from 'react'
import { createTask, type CreateTaskPayload, type TaskResponse } from '../api/tasks'
import { useApi } from '../hooks/useApi'

interface TaskFormProps {
  onTaskCreated: (task: TaskResponse) => void
}

export function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<number | ''>('')

  const { execute, loading, error, fieldErrors, reset } = useApi<
    TaskResponse,
    [CreateTaskPayload]
  >(createTask)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!title.trim() || priority === '') return

      const result = await execute({
        title: title.trim(),
        description: description.trim(),
        priority: Number(priority),
      })

      if (result) {
        onTaskCreated(result)
        setTitle('')
        setDescription('')
        setPriority('')
        reset()
      }
    },
    [title, description, priority, execute, onTaskCreated, reset]
  )

 
  const priorityError = fieldErrors['priority']?.[0]
  const titleError = fieldErrors['title']?.[0]

  return (
    <form onSubmit={handleSubmit} className="task-form" noValidate>
      <h2 className="form-title">New Task</h2>

     
      {error && !priorityError && !titleError && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      
      <div className="field">
        <label htmlFor="title" className="label">
          Title <span className="required">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="....."
          className={`input ${titleError ? 'input-error' : ''}`}
          required
          maxLength={200}
        />
        
        {titleError && <span className="field-error">{titleError}</span>}
      </div>

      
      <div className="field">
        <label htmlFor="description" className="label">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="details about the task..."
          className="input textarea"
          rows={3}
          maxLength={1000}
        />
      </div>

      
      <div className="field">
        <label htmlFor="priority" className="label">
          Priority <span className="required">*</span>
          <span className="hint"> (1 = Low, 5 = Critical)</span>
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value === '' ? '' : Number(e.target.value))}
          className={`input select ${priorityError ? 'input-error' : ''}`}
          required
        >
          <option value="">Select priority…</option>
          {[1, 2, 3, 4, 5].map((p) => (
            <option key={p} value={p}>
              {p} — {['Low', 'Medium-Low', 'Medium', 'High', 'Critical'][p - 1]}
            </option>
          ))}
        </select>
        {priorityError && <span className="field-error">{priorityError}</span>}
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? (
          <>
            <span className="spinner" aria-hidden="true" /> Creating…
          </>
        ) : (
          '+ Add Task'
        )}
      </button>
    </form>
  )
}
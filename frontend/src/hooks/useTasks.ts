import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { fetchTasks, completeTask, deleteTask, type TaskResponse } from '../api/tasks'

export function useTasks() {
  const [tasks, setTasks] = useState<TaskResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadTasks = useCallback(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetchTasks(controller.signal)
      .then((data) => {
        setTasks(data)
        setLoading(false)
      })
      .catch((err) => {
        if (axios.isCancel(err) || err.name === 'CanceledError') {
          return
        }
        setError('Failed to load tasks. Backend Not connected')
        setLoading(false)
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    const cleanup = loadTasks()
    return cleanup
  }, [loadTasks])


  const addTask = useCallback((task: TaskResponse) => {
    setTasks((prev) => [task, ...prev])
  }, [])

  const markComplete = useCallback(async (id: number) => {
    const updated = await completeTask(id)
    setTasks((prev) =>
      prev.map((m) => (m.id === updated.id ? { ...m, ...updated } : m))
    )
  }, [])

  const removeTask = useCallback(async (id: number) => {
    await deleteTask(id)
    setTasks((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const pendingCount = tasks.filter((m) => !m.isCompleted).length

  return {
    tasks,
    loading,
    error,
    pendingCount,
    addTask,
    markComplete,
    removeTask,
    reload: loadTasks,
  }
}
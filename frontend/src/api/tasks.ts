import apiClient from './apiClient'


export interface TaskResponse {
  id: number
  title: string
  description: string
  priority: number
  isCompleted: boolean
  createdAt: string
}

export interface CreateTaskPayload {
  title: string
  description: string
  priority: number
}

export interface ApiError {
  title: string
  detail?: string
  status: number
  errors?: Record<string, string[]>
}


export const fetchTasks = (signal?: AbortSignal): Promise<TaskResponse[]> =>
  apiClient.get<TaskResponse[]>('/api/tasks', { signal }).then((r) => r.data)


export const createTask = (payload: CreateTaskPayload): Promise<TaskResponse> =>
  apiClient.post<TaskResponse>('/api/tasks', payload).then((r) => r.data)


export const completeTask = (id: number): Promise<TaskResponse> =>
  apiClient.patch<TaskResponse>(`/api/tasks/${id}/complete`).then((r) => r.data)

export const deleteTask = (id: number): Promise<void> =>
  apiClient.delete(`/api/tasks/${id}`).then(() => undefined)
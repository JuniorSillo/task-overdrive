import { useState, useCallback } from 'react'
import axios from 'axios'
import type { ApiError } from '../api/tasks'

interface UseApiState<TData> {
  data: TData | null
  loading: boolean
  error: string | null
  fieldErrors: Record<string, string[]>
}

interface UseApiReturn<TData, TArgs extends unknown[]> extends UseApiState<TData> {
  execute: (...args: TArgs) => Promise<TData | null>
  reset: () => void
}

export function useApi<TData, TArgs extends unknown[]>(
  apiFn: (...args: TArgs) => Promise<TData>
): UseApiReturn<TData, TArgs> {
  const [state, setState] = useState<UseApiState<TData>>({
    data: null,
    loading: false,
    error: null,
    fieldErrors: {},
  })

  const execute = useCallback(
    async (...args: TArgs): Promise<TData | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null, fieldErrors: {} }))

      try {
        const result = await apiFn(...args)
        setState({ data: result, loading: false, error: null, fieldErrors: {} })
        return result
      } catch (err: unknown) {
        let errorMsg = 'An unexpected error occurred.'
        let fieldErrors: Record<string, string[]> = {}

        if (axios.isAxiosError(err)) {
          const responseData = err.response?.data as ApiError | undefined

          if (responseData) {
            errorMsg = responseData.detail ?? responseData.title ?? errorMsg

            
            if (responseData.errors) {
              fieldErrors = responseData.errors
            }

            // 409 Conflict
            if (err.response?.status === 409) {
              errorMsg = responseData.detail ?? 'A task with this title already exists.'
            }
          }
        }

        setState({ data: null, loading: false, error: errorMsg, fieldErrors })
        return null
      }
    },
    [apiFn]
  )

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null, fieldErrors: {} })
  }, [])

  return { ...state, execute, reset }
}
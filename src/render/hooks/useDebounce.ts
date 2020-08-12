import { useEffect, useRef } from 'react'

const useDebounce = (fn: () => void, deps: any, ms = 500) => {
  let timeout: any = useRef()
  useEffect(() => {
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => {
      fn()
    }, ms)
  }, [deps])

  const cancel = () => {
    clearTimeout(timeout.current)
    timeout = null
  }

  return [cancel]
}

export default useDebounce

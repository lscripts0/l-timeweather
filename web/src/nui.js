import { useEffect, useRef } from 'react'

export const RES =
  typeof GetParentResourceName === 'function' ? GetParentResourceName() : 'l-timeweather'

export const isBrowser =
  typeof GetParentResourceName === 'undefined' && !window.invokeNative

export function post(cb, data) {
  if (isBrowser) return Promise.resolve()
  return fetch(`https://${RES}/${cb}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(data || {}),
  }).catch(() => {})
}

export function action(name, payload) {
  return post('action', { action: name, payload: payload || {} })
}

export function useNuiEvent(handler) {
  const saved = useRef(handler)
  saved.current = handler
  useEffect(() => {
    const fn = (e) => {
      const d = e.data || {}
      if (d && d.action) saved.current(d.action, d)
    }
    window.addEventListener('message', fn)
    return () => window.removeEventListener('message', fn)
  }, [])
}

export function useEsc(handler) {
  const saved = useRef(handler)
  saved.current = handler
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') saved.current() }
    window.addEventListener('keyup', fn)
    return () => window.removeEventListener('keyup', fn)
  }, [])
}

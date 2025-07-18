// ToastContext.jsx
import React, { createContext, useContext, useState, useCallback } from "react"
import { ToastComponent } from "./ToastComponent"
import { v4 as uuidv4 } from "uuid"

const ToastContext = createContext()

export const useToast = () => useContext(ToastContext)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback(({ type = "success", message, duration = 3000 }) => {
    const id = uuidv4()
    const newToast = { id, type, message, duration }
    setToasts((prev) => [...prev, newToast])
  }, [])

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

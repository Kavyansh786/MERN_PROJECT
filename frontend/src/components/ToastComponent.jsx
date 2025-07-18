"use client"

import { useEffect, useState } from "react"
import { CheckCircle, AlertTriangle, XCircle, X, Sparkles } from "lucide-react"

const toastConfig = {
  success: {
    icon: CheckCircle,
    gradient: "from-emerald-50/90 via-teal-50/90 to-cyan-50/90",
    border: "border-emerald-200/60",
    iconColor: "text-emerald-600",
    textColor: "text-emerald-900",
    shadowColor: "shadow-emerald-100/50",
    accentColor: "bg-emerald-400/20",
  },
  warning: {
    icon: AlertTriangle,
    gradient: "from-amber-50/90 via-orange-50/90 to-yellow-50/90",
    border: "border-amber-200/60",
    iconColor: "text-amber-600",
    textColor: "text-amber-900",
    shadowColor: "shadow-amber-100/50",
    accentColor: "bg-amber-400/20",
  },
  error: {
    icon: XCircle,
    gradient: "from-rose-50/90 via-pink-50/90 to-red-50/90",
    border: "border-rose-200/60",
    iconColor: "text-rose-600",
    textColor: "text-rose-900",
    shadowColor: "shadow-rose-100/50",
    accentColor: "bg-rose-400/20",
  },
}

export function ToastComponent({ toast, onRemove }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const [progress, setProgress] = useState(100)

  const config = toastConfig[toast.type]
  const Icon = config.icon

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - 100 / (toast.duration / 100)
          if (newProgress <= 0) {
            handleClose()
            return 0
          }
          return newProgress
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [toast.duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onRemove(toast.id)
    }, 400)
  }

  return (
    <div
      className={`
        transform transition-all duration-500 ease-out mb-4
        ${isVisible && !isLeaving ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95"}
      `}
    >
      <div
        className={`
          bg-gradient-to-br ${config.gradient}
          ${config.border} ${config.textColor} ${config.shadowColor}
          border backdrop-blur-xl rounded-2xl shadow-2xl
          p-5 pr-14 min-w-[380px] max-w-[420px]
          relative overflow-hidden
          hover:shadow-3xl hover:scale-[1.02] transition-all duration-300
        `}
      >
        <div className={`absolute top-0 left-0 right-0 h-1 ${config.accentColor} rounded-t-2xl`} />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 rounded-b-2xl overflow-hidden">
          <div
            className={`h-full ${config.accentColor} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <Sparkles className="absolute top-3 right-12 w-4 h-4 text-white/30" />
        <div className="flex items-start gap-4">
          <div className={`${config.accentColor} p-2 rounded-xl`}>
            <Icon className={`${config.iconColor} w-6 h-6`} />
          </div>
          <div className="flex-1 pt-1">
            <p className="text-sm font-semibold leading-relaxed tracking-wide">{toast.message}</p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className={`
            absolute top-4 right-4 p-2 rounded-xl
            hover:bg-black/10 active:bg-black/20
            transition-all duration-200 ease-out
            ${config.iconColor} hover:scale-110
            group
          `}
          aria-label="Close notification"
        >
          <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
        </button>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: any | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  })
  const router = useRouter()

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    if (token) {
      // Validate token on client side (simple check)
      setAuthState({ isAuthenticated: true, isLoading: false, user: null })
    } else {
      setAuthState({ isAuthenticated: false, isLoading: false, user: null })
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errData = await response.json()
        return { error: errData.message || "Login failed" }
      }

      const data = await response.json()
      // Store token
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token)
      }
      setAuthState({ isAuthenticated: true, isLoading: false, user: data.user })
      router.push("/dashboard")
      return { success: true }
    } catch (error) {
      return { error: "An error occurred. Please try again." }
    }
  }

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
    }
    setAuthState({ isAuthenticated: false, isLoading: false, user: null })
    router.replace("/")
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const errData = await response.json()
        return { error: errData.message || "Registration failed" }
      }

      const data = await response.json()
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token)
      }
      setAuthState({ isAuthenticated: true, isLoading: false, user: data.user })
      router.push("/dashboard")
      return { success: true }
    } catch (error) {
      return { error: "An error occurred. Please try again." }
    }
  }

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    register,
  }
}
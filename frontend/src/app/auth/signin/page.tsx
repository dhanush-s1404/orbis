"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const result = await login(email, password)
      if (result.error) {
        setError(result.error)
        return
      }
      // Login handled by useAuth hook - redirect inside
    } catch (error: any) {
      setError("An error occurred. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6 text-center">Sign In</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-zinc-100 rounded-md text-zinc-800">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="mb-6 text-center">
            <p className="text-zinc-500">Signing in...</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-zinc-700 text-sm font-medium mb-2">Email</label>
            <input 
              type="email" 
              name="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="email@example.com"
              required
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-zinc-700 text-sm font-medium mb-2">Password</label>
            <input 
              type="password" 
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-zinc-900 text-white font-medium py-2 rounded-md hover:bg-zinc-800 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  )
}
"use client"

import type React from "react"
import { createContext, useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, type User, signOut } from "firebase/auth"
import { addUserDataToLocalStorage, removeUserDataFromLocalStorage } from "./localstorage"
import Cookies from "js-cookie"
import { toast } from "@/hooks/use-toast"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    if (!auth) {
      setLoading(false)
      setError("Firebase authentication is not initialized. Please check your environment variables.")
      return
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (isMounted) {
          console.log("Auth state changed:", user)
          if (user) {
            if (user.emailVerified) {
              setUser(user)
              addUserDataToLocalStorage(user)
              try {
                const token = await user.getIdToken()
                Cookies.set("auth-token", token, { expires: 7 })
              } catch (err) {
                // console.error('Error fetching token:', err);
                toast({
                  title: "Please connect to the network",
                  variant: "destructive",
                })
                setError("Error fetching token.")
              }
            } else {
              await signOut(auth).catch((err) => {
                console.error("Error during sign-out:", err)
                setError("Error signing out.")
              })
              setUser(null)
              setError("Please verify your email before logging in.")
              toast({
                title: "Please verify your email before logging in.",
                variant: "destructive",
              })
              Cookies.remove("auth-token")
              removeUserDataFromLocalStorage()
            }
          } else {
            setUser(null)
            Cookies.remove("auth-token")
            removeUserDataFromLocalStorage()
          }

          setLoading(false)
        }
      },
      (error) => {
        if (isMounted) {
          console.error("Auth state change error:", error)
          setError("Authentication error: " + error.message)
          setLoading(false)
        }
        Cookies.remove("auth-token")
        removeUserDataFromLocalStorage()
      },
    )

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={{ user, loading, error }}>{children}</AuthContext.Provider>
}

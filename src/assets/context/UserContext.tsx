"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface UserContextType {
  username: string
  isModalOpen: boolean
  login: (name: string) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string>("")
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  useEffect(() => {
    if(isModalOpen){
      document.body.style.overflow = "hidden"
    }else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isModalOpen]);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username")
    if (savedUsername) {
      setUsername(savedUsername)
      setIsModalOpen(false)
    } else {
      setIsModalOpen(true)
    }
  }, [])

  const login = (name: string) => {
    setUsername(name)
    localStorage.setItem("username", name)
    setIsModalOpen(false)
  }

  const logout = () => {
    setUsername("")
    localStorage.removeItem("username")
    setIsModalOpen(true)
  }

  return <UserContext.Provider value={{ username, isModalOpen, login, logout }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error("useUser должен использоваться внутри UserProvider")
  }

  return context
}

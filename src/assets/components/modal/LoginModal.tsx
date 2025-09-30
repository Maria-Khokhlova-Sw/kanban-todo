"use client"

import type { FormEvent } from "react"
import { useUser } from "../../context/UserContext"
import "./loginModal.css"

export default function LoginModal() {
  const { login } = useUser()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const username = formData.get("username") as string

    if (username.trim()) {
      login(username.trim())
    }
  }

  return (
    <div className="login-background">
      <div className="login-modal">
        <div className="login-modal-header">
          <div className="login-modal-title">Введите ваше имя</div>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="имя" className="inputName" required />
          <button type="submit" className="loginButton">
            Войти
          </button>
        </form>
      </div>

    </div>
  )
}

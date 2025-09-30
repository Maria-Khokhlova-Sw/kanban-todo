"use client"

import { useUser } from "../../context/UserContext"
import "./header.css"


export default function Header() {
  const { username, logout } = useUser()

  return (
    <header className="header">
      <div className="menu">
        <div className="menu-logo">Logo</div>
        <div className="menu-content">
          <div className="menu-user">{username || "User"}</div>

          <div className="menu-exit" onClick={logout}>
            ✕
          </div>
        </div>
      </div>
    </header>
  )
}

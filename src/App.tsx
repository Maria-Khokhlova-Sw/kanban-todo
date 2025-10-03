"use client"

import { UserProvider, useUser } from "./assets/context/UserContext"
import Header from "./assets/components/header/Header"
import LoginModal from "./assets/components/modal/LoginModal"
import Window from "@/src/assets/components/window/Window";

function AppContent() {
  const { isModalOpen } = useUser()

  return (
    <>
      <Header />
      {isModalOpen && <LoginModal />}
        <Window />
    </>
  )
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  )
}

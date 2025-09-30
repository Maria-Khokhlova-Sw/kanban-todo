"use client"

import Section from "../kanban/Section";
import {useUser} from "@/src/assets/context/UserContext";
import "../../../../styles/globals.css"

export default function Window() {
    const { isModalOpen } = useUser()
    return (
        <div className="Window">
            {!isModalOpen && <Section/>}
        </div>
    )
}
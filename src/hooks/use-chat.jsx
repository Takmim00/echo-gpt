"use client"

import { useState } from "react"
import { sendChatMessage } from "@/lib/api"

export function useChat() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (message, chatId) => {
    setIsLoading(true)
    try {
      const response = await sendChatMessage(message, chatId)
      return response
    } finally {
      setIsLoading(false)
    }
  }

  return {
    input,
    setInput,
    isLoading,
    sendMessage,
  }
}


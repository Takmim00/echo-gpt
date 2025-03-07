"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ChatContainer } from "@/components/chat-container"

export function ChatLayout() {
  const [chats, setChats] = useState([])
  const [currentChatId, setCurrentChatId] = useState(null)

  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
    }

    setChats((prev) => [newChat, ...prev])
    setCurrentChatId(newChat.id)
    return newChat
  }

  const getCurrentChat = () => {
    return chats.find((chat) => chat.id === currentChatId) || null
  }

  const updateChat = (updatedChat) => {
    setChats((prev) => prev.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat)))
  }

  const deleteChat = (chatId) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId))
    if (currentChatId === chatId) {
      setCurrentChatId(chats.length > 1 ? chats[0].id : null)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onChatSelect={setCurrentChatId}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
      />
      <ChatContainer chat={getCurrentChat()} onNewChat={createNewChat} onUpdateChat={updateChat} />
    </div>
  )
}


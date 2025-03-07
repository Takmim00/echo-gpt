"use client"

import { useState } from "react"
import { PlusCircle, MessageSquare, Trash2, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

export function Sidebar({ chats, currentChatId, onChatSelect, onNewChat, onDeleteChat }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 md:hidden z-50"
        onClick={toggleMobileSidebar}
      >
        {isMobileOpen ? <X /> : <Menu />}
      </Button>

      <div
        className={cn(
          "bg-secondary/50 w-80 flex-shrink-0 border-r border-border flex flex-col h-full",
          "fixed inset-y-0 left-0 z-40 md:relative",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "transition-transform duration-200 ease-in-out",
        )}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h1 className="text-xl font-bold">EchoChat</h1>
          <ThemeToggle />
        </div>

        <div className="p-4">
          <Button onClick={onNewChat} className="w-full flex items-center gap-2">
            <PlusCircle size={16} />
            New Chat
          </Button>
        </div>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2 py-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-md cursor-pointer group",
                  currentChatId === chat.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
                )}
                onClick={() => {
                  onChatSelect(chat.id)
                  if (isMobileOpen) setIsMobileOpen(false)
                }}
              >
                <div className="flex items-center gap-2 truncate">
                  <MessageSquare size={16} />
                  <span className="truncate">{chat.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "opacity-0 group-hover:opacity-100",
                    currentChatId === chat.id && "text-primary-foreground opacity-100",
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteChat(chat.id)
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}

            {chats.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No chats yet. Create a new chat to get started.
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground">Powered by EchoGPT</div>
        </div>
      </div>
    </>
  )
}


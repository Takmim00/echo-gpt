"use client"

import { useRef, useEffect } from "react"
import { SendHorizontal, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useChat } from "@/hooks/use-chat"

export function ChatContainer({ chat, onNewChat, onUpdateChat }) {
  const { input, setInput, isLoading, sendMessage } = useChat()
  const scrollAreaRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [chat?.messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    let currentChat = chat
    if (!currentChat) {
      currentChat = onNewChat()
    }

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      createdAt: new Date().toISOString(),
    }

    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, userMessage],
      title: currentChat.messages.length === 0 ? input.slice(0, 30) : currentChat.title,
    }

    onUpdateChat(updatedChat)
    setInput("")

    try {
      const response = await sendMessage(input, updatedChat.id)

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        createdAt: new Date().toISOString(),
      }

      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, assistantMessage],
      }

      onUpdateChat(finalChat)
    } catch (error) {
      console.error("Failed to send message:", error)

      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, there was an error processing your request. Please try again.",
        createdAt: new Date().toISOString(),
      }

      onUpdateChat({
        ...updatedChat,
        messages: [...updatedChat.messages, errorMessage],
      })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 overflow-hidden relative">
        {chat?.messages.length ? (
          <ScrollArea ref={scrollAreaRef} className="h-full p-4 md:p-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {chat.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-4 rounded-lg p-4",
                    message.role === "user" ? "bg-secondary/50" : "bg-background border border-border",
                  )}
                >
                  <div
                    className={cn(
                      "rounded-full p-2 flex-shrink-0",
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                    )}
                  >
                    {message.role === "user" ? <User size={18} /> : <Bot size={18} />}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="prose dark:prose-invert max-w-none">{message.content}</div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-4 rounded-lg p-4 bg-background border border-border">
                  <div className="rounded-full p-2 bg-muted flex-shrink-0">
                    <Bot size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-4 md:p-8">
            <div className="max-w-md text-center space-y-4">
              <div className="bg-primary/10 p-4 rounded-full inline-flex">
                <Bot size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Welcome to EchoChat</h2>
              <p className="text-muted-foreground">
                Start a conversation with EchoGPT. Ask questions, get creative responses, or just chat about anything.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-12 resize-none"
            rows={1}
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} size="icon">
            <SendHorizontal />
          </Button>
        </div>
      </div>
    </div>
  )
}


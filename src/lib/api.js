export async function sendChatMessage(message, chatId) {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          chatId,
        }),
      })
  
      if (!response.ok) {
        throw new Error("Failed to send message")
      }
  
      const data = await response.json()
      return data.response
    } catch (error) {
      console.error("Error sending message:", error)
      throw error
    }
  }
  
  
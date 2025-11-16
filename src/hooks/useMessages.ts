import { useEffect, useState } from "react";
import { chatService } from "../services/chatService";
import type { Message } from "../types";

export const useMessages = (sessionId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = chatService.subscribeToMessages(
      sessionId,
      (newMessages) => {
        setMessages(newMessages);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [sessionId]);

  const sendMessage = async (text: string, adminId: string = "admin-001") => {
    if (!sessionId || !text.trim()) return;

    try {
      await chatService.sendAdminMessage(sessionId, text.trim(), adminId);
    } catch (err) {
      setError("Failed to send message");
      console.error("Error sending message:", err);
      throw err;
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
  };
};

import { useEffect, useState } from "react";
import { chatService } from "../services/chatService";
import type { ChatSession } from "../types";

export const useChatSessions = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = chatService.subscribeToChatSessions((newSessions) => {
      setSessions(newSessions);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const updateSessionStatus = async (
    sessionId: string,
    status: "active" | "waiting" | "closed"
  ) => {
    try {
      await chatService.updateSessionStatus(sessionId, status);
    } catch (err) {
      setError("Failed to update session status");
      console.error("Error updating session status:", err);
    }
  };

  const markAsRead = async (sessionId: string) => {
    try {
      await chatService.markMessagesAsRead(sessionId);
    } catch (err) {
      setError("Failed to mark messages as read");
      console.error("Error marking messages as read:", err);
    }
  };

  return {
    sessions,
    loading,
    error,
    updateSessionStatus,
    markAsRead,
  };
};

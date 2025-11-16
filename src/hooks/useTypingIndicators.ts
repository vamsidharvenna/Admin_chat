import { useEffect, useState } from "react";
import { chatService } from "../services/chatService";
import type { TypingIndicator } from "../types";

export const useTypingIndicators = () => {
  const [typingIndicators, setTypingIndicators] = useState<TypingIndicator[]>(
    []
  );

  useEffect(() => {
    const unsubscribe = chatService.subscribeToTypingIndicators(
      (indicators) => {
        // Filter out old typing indicators (older than 10 seconds)
        const now = new Date();
        const filtered = indicators.filter((indicator) => {
          const timeDiff = now.getTime() - indicator.timestamp.getTime();
          return timeDiff < 10000; // 10 seconds
        });

        setTypingIndicators(filtered);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const isUserTyping = (sessionId: string, userId: string): boolean => {
    return typingIndicators.some(
      (indicator) =>
        indicator.sessionId === sessionId &&
        indicator.userId === userId &&
        indicator.isTyping
    );
  };

  return {
    typingIndicators,
    isUserTyping,
  };
};

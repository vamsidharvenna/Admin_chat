export interface Message {
  id: string;
  text: string;
  timestamp: Date;
  sender: "user" | "admin" | "bot";
  isRead?: boolean;
  sessionId: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  userAvatar?: string;
  lastMessage?: Message;
  lastActivity: Date;
  unreadCount: number;
  status: "active" | "waiting" | "closed";
  metadata?: {
    userAgent?: string;
    referrer?: string;
    location?: string;
    [key: string]: any;
  };
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: Date;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "support";
  avatar?: string;
}

export interface ChatFilter {
  status?: "active" | "waiting" | "closed" | "all";
  searchTerm?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface TypingIndicator {
  sessionId: string;
  userId: string;
  isTyping: boolean;
  timestamp: Date;
}

import {
  QuerySnapshot,
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
} from "firebase/firestore";
import type { ChatSession, Message, TypingIndicator } from "../types";
import { db } from "./firebase";

export class ChatService {
  // Collections - matching your Cloud Run function
  private readonly SESSIONS_COLLECTION = "conversations";
  private readonly MESSAGES_COLLECTION = "messages";
  private readonly TYPING_COLLECTION = "typingIndicators";

  // Subscribe to all chat sessions
  subscribeToChatSessions(callback: (sessions: ChatSession[]) => void) {
    console.log(
      "🔍 Subscribing to chat sessions from collection:",
      this.SESSIONS_COLLECTION
    );

    const sessionsQuery = query(
      collection(db, this.SESSIONS_COLLECTION)
      // orderBy commented out since your data might not have lastActivity initially
      // orderBy("lastActivity", "desc")
    );
    return onSnapshot(
      sessionsQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        console.log("📊 Firestore snapshot received:", {
          empty: snapshot.empty,
          size: snapshot.size,
          docs: snapshot.docs.length,
        });

        if (snapshot.empty) {
          console.log(
            "⚠️ No documents found in collection:",
            this.SESSIONS_COLLECTION
          );
          console.log(
            "💡 Make sure you have data in the correct collection and proper Firestore rules"
          );
        }

        const sessions: ChatSession[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("📄 Document:", doc.id, " => ", data);

          // Map your Cloud Run data structure to ChatSession interface
          return {
            id: doc.id,
            userId: doc.id, // Using doc ID as userId since it's the sessionId
            userName: data.userName || "Anonymous User",
            userEmail: data.userEmail || undefined,
            userAvatar: data.userAvatar || undefined,
            lastActivity:
              data.updatedAt?.toDate() ||
              data.createdAt?.toDate() ||
              new Date(),
            unreadCount: data.unreadCount || 0,
            status: this.mapStatus(data.status),
            metadata: data.metadata || {},
            lastMessage: data.lastMessage
              ? {
                  id: "last-msg",
                  text: data.lastMessage,
                  timestamp:
                    data.updatedAt?.toDate() ||
                    data.createdAt?.toDate() ||
                    new Date(),
                  sender: "user" as const,
                  sessionId: doc.id,
                  isRead: false,
                }
              : undefined,
          } as ChatSession;
        });

        console.log("✅ Processed sessions:", sessions.length);
        callback(sessions);
      },
      (error) => {
        console.error("❌ Error subscribing to chat sessions:", error);
        console.error(
          "🔧 Check your Firestore rules and Firebase configuration"
        );
        // Still call callback with empty array to prevent app crashes
        callback([]);
      }
    );
  }

  // Subscribe to messages for a specific session (subcollection)
  subscribeToMessages(
    sessionId: string,
    callback: (messages: Message[]) => void
  ) {
    console.log("🔍 Subscribing to messages for session:", sessionId);

    // Messages are stored in subcollection: conversations/{sessionId}/messages
    const messagesQuery = query(
      collection(
        db,
        this.SESSIONS_COLLECTION,
        sessionId,
        this.MESSAGES_COLLECTION
      ),
      orderBy("timestamp", "asc")
    );

    return onSnapshot(
      messagesQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        console.log("💬 Messages snapshot:", {
          empty: snapshot.empty,
          size: snapshot.size,
        });

        const messages: Message[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("📄 Message:", doc.id, "=>", data);

          return {
            id: doc.id,
            text: data.text || "",
            sender: data.sender || "user",
            timestamp: data.timestamp?.toDate() || new Date(),
            sessionId: sessionId,
            isRead: data.isRead || false,
          } as Message;
        });

        console.log("✅ Processed messages:", messages.length);
        callback(messages);
      },
      (error) => {
        console.error("❌ Error subscribing to messages:", error);
        callback([]);
      }
    );
  }

  // Subscribe to typing indicators
  subscribeToTypingIndicators(
    callback: (indicators: TypingIndicator[]) => void
  ) {
    const typingQuery = query(
      collection(db, this.TYPING_COLLECTION),
      where("isTyping", "==", true)
    );

    return onSnapshot(typingQuery, (snapshot: QuerySnapshot<DocumentData>) => {
      const indicators: TypingIndicator[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          timestamp: data.timestamp?.toDate() || new Date(),
        } as TypingIndicator;
      });
      callback(indicators);
    });
  }

  // Helper method to map status from your Cloud Run function to expected format
  private mapStatus(status: string): "active" | "waiting" | "closed" {
    switch (status) {
      case "open":
        return "active";
      case "waiting":
        return "waiting";
      case "closed":
        return "closed";
      default:
        return "waiting";
    }
  }

  // Send a message from admin
  async sendAdminMessage(
    sessionId: string,
    text: string,
    adminId: string
  ): Promise<void> {
    console.log("📝 Sending admin message to session:", sessionId);

    // Add message to subcollection: conversations/{sessionId}/messages
    const messageData = {
      sender: "admin" as const,
      text: text,
      timestamp: serverTimestamp(),
      adminId: adminId,
      isRead: false,
    };

    const batch = writeBatch(db);

    // Add the message to subcollection
    const messageRef = doc(
      collection(
        db,
        this.SESSIONS_COLLECTION,
        sessionId,
        this.MESSAGES_COLLECTION
      )
    );
    batch.set(messageRef, messageData);

    // Update the conversation's last message and status
    const sessionRef = doc(db, this.SESSIONS_COLLECTION, sessionId);
    batch.update(sessionRef, {
      lastMessage: text,
      status: "open", // Using 'open' to match your Cloud Run function
      updatedAt: serverTimestamp(),
    });

    await batch.commit();
    console.log("✅ Admin message sent successfully");
  }

  // Create a new chat session (matching your Cloud Run function structure)
  async createChatSession(
    userEmail?: string,
    userName?: string,
    metadata?: any
  ): Promise<string> {
    const sessionData = {
      createdAt: serverTimestamp(),
      lastMessage: "",
      status: "open",
      userName: userName || "Anonymous User",
      userEmail: userEmail,
      unreadCount: 0,
      metadata: metadata || {},
    };

    const docRef = await addDoc(
      collection(db, this.SESSIONS_COLLECTION),
      sessionData
    );
    return docRef.id;
  }

  // Update session status (mapping to your Cloud Run status values)
  async updateSessionStatus(
    sessionId: string,
    status: "active" | "waiting" | "closed"
  ): Promise<void> {
    const sessionRef = doc(db, this.SESSIONS_COLLECTION, sessionId);

    // Map status to your Cloud Run function values
    const mappedStatus = status === "active" ? "open" : status;

    await updateDoc(sessionRef, {
      status: mappedStatus,
      updatedAt: serverTimestamp(),
    });
  }

  // Mark messages as read (subcollection approach)
  async markMessagesAsRead(sessionId: string): Promise<void> {
    console.log("📩 Marking messages as read for session:", sessionId);

    const messagesQuery = query(
      collection(
        db,
        this.SESSIONS_COLLECTION,
        sessionId,
        this.MESSAGES_COLLECTION
      ),
      where("isRead", "==", false),
      where("sender", "!=", "admin")
    );

    const snapshot = await getDocs(messagesQuery);

    if (!snapshot.empty) {
      const batch = writeBatch(db);

      snapshot.docs.forEach((messageDoc) => {
        batch.update(messageDoc.ref, { isRead: true });
      });

      // Also reset unread count in main conversation doc
      const sessionRef = doc(db, this.SESSIONS_COLLECTION, sessionId);
      batch.update(sessionRef, { unreadCount: 0 });

      await batch.commit();
      console.log("✅ Messages marked as read");
    }
  }

  // Update typing indicator
  async updateTypingIndicator(
    sessionId: string,
    userId: string,
    isTyping: boolean
  ): Promise<void> {
    const typingRef = doc(db, this.TYPING_COLLECTION, `${sessionId}_${userId}`);

    if (isTyping) {
      await updateDoc(typingRef, {
        sessionId,
        userId,
        isTyping: true,
        timestamp: serverTimestamp(),
      });
    } else {
      await updateDoc(typingRef, {
        isTyping: false,
      });
    }
  }

  // Get session statistics
  async getSessionStats() {
    const sessionsQuery = query(collection(db, this.SESSIONS_COLLECTION));
    const snapshot = await getDocs(sessionsQuery);

    const stats = {
      total: snapshot.size,
      active: 0,
      waiting: 0,
      closed: 0,
    };

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.status === "active") stats.active++;
      else if (data.status === "waiting") stats.waiting++;
      else if (data.status === "closed") stats.closed++;
    });

    return stats;
  }
}

export const chatService = new ChatService();

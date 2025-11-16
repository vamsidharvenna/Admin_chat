/**
 * Chat Dashboard Configuration
 * Modify these settings to customize the admin dashboard behavior
 */

export const CHAT_CONFIG = {
  // UI Settings
  ui: {
    maxMessagesDisplayed: 100, // Maximum number of messages to display in chat window
    autoScrollToBottom: true, // Auto-scroll to bottom when new messages arrive
    showTypingIndicators: true, // Show typing indicators from users
    showTimestamps: true, // Show message timestamps
    compactMode: false, // Use compact message layout
  },

  // Chat Settings
  chat: {
    maxMessageLength: 1000, // Maximum characters per message
    typingTimeout: 10000, // Time in ms after which typing indicator disappears
    markAsReadDelay: 1000, // Delay in ms before marking messages as read
    sessionTimeout: 300000, // Time in ms before session is considered inactive (5 min)
  },

  // Real-time Settings
  realtime: {
    enableRealTimeUpdates: true, // Enable real-time updates via Firestore
    connectionRetryAttempts: 3, // Number of reconnection attempts
    reconnectDelay: 5000, // Delay between reconnection attempts in ms
  },

  // Admin Settings
  admin: {
    defaultAdminId: "admin-001", // Default admin ID for messages
    allowSessionClosure: true, // Allow admins to close sessions
    allowSessionReopen: true, // Allow admins to reopen closed sessions
    showUserMetadata: true, // Show user browser/location metadata
  },

  // Performance Settings
  performance: {
    messagesPageSize: 50, // Number of messages to load per page
    sessionsPageSize: 20, // Number of sessions to load per page
    debounceSearchMs: 300, // Debounce delay for search input
    enableLazyLoading: true, // Enable lazy loading for large lists
  },

  // Notification Settings
  notifications: {
    enableSound: false, // Play sound on new messages (requires user permission)
    enableBrowserNotifications: false, // Show browser notifications
    showUnreadCounts: true, // Show unread message counts in UI
  },

  // Theme Settings
  theme: {
    primaryColor: "blue", // Primary theme color (blue, green, purple, etc.)
    borderRadius: "md", // Border radius (sm, md, lg, xl)
    fontSize: "sm", // Base font size (xs, sm, md, lg)
  },

  // Debug Settings
  debug: {
    enableLogging: true, // Enable console logging
    logLevel: "info", // Log level: 'error', 'warn', 'info', 'debug'
    showPerformanceMetrics: false, // Show performance metrics in console
  },
} as const;

/**
 * Firebase Collection Names
 * Modify these if you want to use different collection names in Firestore
 */
export const FIRESTORE_COLLECTIONS = {
  CHAT_SESSIONS: "chatSessions",
  MESSAGES: "messages",
  TYPING_INDICATORS: "typingIndicators",
  ADMIN_USERS: "adminUsers",
} as const;

/**
 * Message Status Constants
 */
export const MESSAGE_STATUS = {
  SENT: "sent",
  DELIVERED: "delivered",
  READ: "read",
  FAILED: "failed",
} as const;

/**
 * Session Status Constants
 */
export const SESSION_STATUS = {
  ACTIVE: "active",
  WAITING: "waiting",
  CLOSED: "closed",
  TRANSFERRED: "transferred",
} as const;

/**
 * User Roles
 */
export const USER_ROLES = {
  ADMIN: "admin",
  SUPPORT: "support",
  MANAGER: "manager",
} as const;

export type ChatConfigType = typeof CHAT_CONFIG;
export type FirestoreCollectionsType = typeof FIRESTORE_COLLECTIONS;

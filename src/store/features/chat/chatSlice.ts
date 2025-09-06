import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  type: "text" | "image" | "file";
  fileUrl?: string;
}

interface ChatRoom {
  id: string;
  name: string;
  type: "direct" | "group" | "class";
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

interface ChatState {
  rooms: ChatRoom[];
  activeRoom: string | null;
  messages: Record<string, Message[]>;
  isTyping: Record<string, string[]>;
  onlineUsers: string[];
}

const initialState: ChatState = {
  rooms: [],
  activeRoom: null,
  messages: {},
  isTyping: {},
  onlineUsers: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setRooms: (state, action: PayloadAction<ChatRoom[]>) => {
      state.rooms = action.payload;
    },
    setActiveRoom: (state, action: PayloadAction<string | null>) => {
      state.activeRoom = action.payload;
    },
    addMessage: (
      state,
      action: PayloadAction<{ roomId: string; message: Message }>
    ) => {
      const { roomId, message } = action.payload;
      if (!state.messages[roomId]) {
        state.messages[roomId] = [];
      }
      state.messages[roomId].push(message);

      // Update last message in room
      const room = state.rooms.find((r) => r.id === roomId);
      if (room) {
        room.lastMessage = message;
      }
    },
    setMessages: (
      state,
      action: PayloadAction<{ roomId: string; messages: Message[] }>
    ) => {
      const { roomId, messages } = action.payload;
      state.messages[roomId] = messages;
    },
    setTyping: (
      state,
      action: PayloadAction<{
        roomId: string;
        userId: string;
        isTyping: boolean;
      }>
    ) => {
      const { roomId, userId, isTyping } = action.payload;
      if (!state.isTyping[roomId]) {
        state.isTyping[roomId] = [];
      }

      if (isTyping && !state.isTyping[roomId].includes(userId)) {
        state.isTyping[roomId].push(userId);
      } else if (!isTyping) {
        state.isTyping[roomId] = state.isTyping[roomId].filter(
          (id) => id !== userId
        );
      }
    },
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
    incrementUnread: (state, action: PayloadAction<string>) => {
      const room = state.rooms.find((r) => r.id === action.payload);
      if (room && room.id !== state.activeRoom) {
        room.unreadCount += 1;
      }
    },
    resetUnread: (state, action: PayloadAction<string>) => {
      const room = state.rooms.find((r) => r.id === action.payload);
      if (room) {
        room.unreadCount = 0;
      }
    },
  },
});

export const {
  setRooms,
  setActiveRoom,
  addMessage,
  setMessages,
  setTyping,
  setOnlineUsers,
  incrementUnread,
  resetUnread,
} = chatSlice.actions;

export default chatSlice.reducer;

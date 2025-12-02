import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sendMessage as sendMessageService, generateReply as generateReplyService, getDailyDigest } from '../../services/chatService';

// Async thunks
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ message, conversationId }, { rejectWithValue }) => {
    try {
      const data = await sendMessageService(message, conversationId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const generateReply = createAsyncThunk(
  'chat/generateReply',
  async ({ emailId, instructions }, { rejectWithValue }) => {
    try {
      const data = await generateReplyService(emailId, instructions);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDailyDigest = createAsyncThunk(
  'chat/fetchDailyDigest',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getDailyDigest();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    conversationId: null,
    loading: false,
    error: null,
    generatedReply: null,
    replyLoading: false,
    digest: null,
    digestLoading: false,
    suggestions: [
      "Show me my recent emails",
      "Summarize my unread emails",
      "Send an email to...",
      "Delete spam emails",
      "Search for emails from..."
    ]
  },
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
      state.conversationId = null;
    },
    clearGeneratedReply: (state) => {
      state.generatedReply = null;
    },
    addUserMessage: (state, action) => {
      state.messages.push({
        role: 'user',
        content: action.payload,
        timestamp: new Date().toISOString()
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.conversationId = action.payload.conversation_id;
        // Add assistant response
        state.messages.push({
          role: 'assistant',
          content: action.payload.response,
          timestamp: new Date().toISOString(),
          action: action.payload.action,
          result: action.payload.result
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Generate reply
      .addCase(generateReply.pending, (state) => {
        state.replyLoading = true;
        state.error = null;
      })
      .addCase(generateReply.fulfilled, (state, action) => {
        state.replyLoading = false;
        state.generatedReply = action.payload;
      })
      .addCase(generateReply.rejected, (state, action) => {
        state.replyLoading = false;
        state.error = action.payload;
      })
      // Fetch daily digest
      .addCase(fetchDailyDigest.pending, (state) => {
        state.digestLoading = true;
        state.error = null;
      })
      .addCase(fetchDailyDigest.fulfilled, (state, action) => {
        state.digestLoading = false;
        state.digest = action.payload;
      })
      .addCase(fetchDailyDigest.rejected, (state, action) => {
        state.digestLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages, clearGeneratedReply, addUserMessage } = chatSlice.actions;
export default chatSlice.reducer;

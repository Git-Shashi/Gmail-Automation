import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRecentEmails, sendEmail as sendEmailService, deleteEmail as deleteEmailService, searchEmails as searchEmailsService } from '../../services/emailService';

// Async thunks
export const fetchEmails = createAsyncThunk(
  'email/fetchEmails',
  async (count = 20, { rejectWithValue }) => {
    try {
      const data = await getRecentEmails(count);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendEmail = createAsyncThunk(
  'email/sendEmail',
  async (emailData, { rejectWithValue }) => {
    try {
      const data = await sendEmailService(emailData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteEmail = createAsyncThunk(
  'email/deleteEmail',
  async (emailId, { rejectWithValue }) => {
    try {
      await deleteEmailService(emailId);
      return emailId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchEmails = createAsyncThunk(
  'email/searchEmails',
  async (query, { rejectWithValue }) => {
    try {
      const data = await searchEmailsService(query);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const emailSlice = createSlice({
  name: 'email',
  initialState: {
    emails: [],
    selectedEmail: null,
    searchResults: [],
    categories: {
      urgent: [],
      work: [],
      personal: [],
      promotions: [],
      other: []
    },
    loading: false,
    error: null,
    sendingEmail: false,
    sendError: null,
  },
  reducers: {
    selectEmail: (state, action) => {
      state.selectedEmail = action.payload;
    },
    clearSelectedEmail: (state) => {
      state.selectedEmail = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    categorizeEmails: (state) => {
      state.categories = {
        urgent: state.emails.filter(e => e.category === 'urgent'),
        work: state.emails.filter(e => e.category === 'work'),
        personal: state.emails.filter(e => e.category === 'personal'),
        promotions: state.emails.filter(e => e.category === 'promotions'),
        other: state.emails.filter(e => !e.category || e.category === 'other')
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch emails
      .addCase(fetchEmails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmails.fulfilled, (state, action) => {
        state.loading = false;
        state.emails = action.payload.emails || [];
        // Auto-categorize
        state.categories = {
          urgent: state.emails.filter(e => e.category === 'urgent'),
          work: state.emails.filter(e => e.category === 'work'),
          personal: state.emails.filter(e => e.category === 'personal'),
          promotions: state.emails.filter(e => e.category === 'promotions'),
          other: state.emails.filter(e => !e.category || e.category === 'other')
        };
      })
      .addCase(fetchEmails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Send email
      .addCase(sendEmail.pending, (state) => {
        state.sendingEmail = true;
        state.sendError = null;
      })
      .addCase(sendEmail.fulfilled, (state, action) => {
        state.sendingEmail = false;
      })
      .addCase(sendEmail.rejected, (state, action) => {
        state.sendingEmail = false;
        state.sendError = action.payload;
      })
      // Delete email
      .addCase(deleteEmail.fulfilled, (state, action) => {
        state.emails = state.emails.filter(e => e.id !== action.payload);
        if (state.selectedEmail?.id === action.payload) {
          state.selectedEmail = null;
        }
      })
      // Search emails
      .addCase(searchEmails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchEmails.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.emails || [];
      })
      .addCase(searchEmails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { selectEmail, clearSelectedEmail, clearSearchResults, categorizeEmails } = emailSlice.actions;
export default emailSlice.reducer;

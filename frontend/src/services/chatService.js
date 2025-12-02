import api from './authService';

// Send chat message
export const sendMessage = async (message, conversationId = null) => {
  try {
    const response = await api.post('/chat/message', {
      message,
      conversation_id: conversationId
    });
    return response.data;
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
};

// Generate AI reply for email
export const generateReply = async (emailId, instructions = null) => {
  try {
    const response = await api.post('/chat/generate-reply', {
      email_id: emailId,
      instructions
    });
    return response.data;
  } catch (error) {
    console.error('Failed to generate reply:', error);
    throw error;
  }
};

// Get daily digest
export const getDailyDigest = async (count = 20) => {
  try {
    const response = await api.get('/chat/digest', {
      params: { count }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get digest:', error);
    throw error;
  }
};

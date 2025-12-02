import api from './authService';

// Get recent emails
export const getRecentEmails = async (count = 5) => {
  try {
    const response = await api.get('/emails/recent', {
      params: { count }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch emails:', error);
    throw error;
  }
};

// Search emails
export const searchEmails = async (query, maxResults = 10) => {
  try {
    const response = await api.get('/emails/search/query', {
      params: { query, max_results: maxResults }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to search emails:', error);
    throw error;
  }
};

// Send email
export const sendEmail = async (emailData) => {
  try {
    const response = await api.post('/emails/send', emailData);
    return response.data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

// Delete email
export const deleteEmail = async (emailId) => {
  try {
    const response = await api.delete(`/emails/${emailId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete email:', error);
    throw error;
  }
};

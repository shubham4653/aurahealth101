import { api } from './auth';

// Chat API functions
export const getOrCreateConversation = async (participantId, participantType) => {
  try {
    const response = await api.post('/chat/conversation', {
      participantId,
      participantType
    }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error creating/getting conversation:', error);
    throw error;
  }
};

export const getConversations = async () => {
  try {
    const response = await api.get('/chat/conversations', { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

export const sendMessage = async (messageData, file = null) => {
  try {
    const formData = new FormData();
    
    // Add message data
    Object.keys(messageData).forEach(key => {
      if (messageData[key] !== null && messageData[key] !== undefined) {
        if (typeof messageData[key] === 'object') {
          formData.append(key, JSON.stringify(messageData[key]));
        } else {
          formData.append(key, messageData[key]);
        }
      }
    });

    // Add file if present
    if (file) {
      formData.append('file', file);
    }

    const response = await api.post('/chat/message', formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getMessages = async (conversationId, page = 1, limit = 50) => {
  try {
    const response = await api.get(`/chat/messages/${conversationId}?page=${page}&limit=${limit}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const markAsRead = async (conversationId) => {
  try {
    const response = await api.patch(`/chat/messages/${conversationId}/read`, {}, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

export const updateMessage = async (messageId, content) => {
  try {
    const response = await api.patch(`/chat/message/${messageId}`, {
      content
    }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error updating message:', error);
    throw error;
  }
};

export const deleteMessage = async (messageId) => {
  try {
    const response = await api.delete(`/chat/message/${messageId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

export const addReaction = async (messageId, emoji) => {
  try {
    const response = await api.post(`/chat/message/${messageId}/reaction`, {
      emoji
    }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error adding reaction:', error);
    throw error;
  }
};

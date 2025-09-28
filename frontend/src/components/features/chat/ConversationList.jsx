import React from 'react';
import { MessageCircle, Phone, Video } from 'lucide-react';
import { ThemeContext } from '../../../context/ThemeContext';
import { useContext } from 'react';

const ConversationList = ({ 
  conversations, 
  currentUserId, 
  onSelectConversation, 
  onStartVideoCall,
  user 
}) => {
  const { theme } = useContext(ThemeContext);

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(
      p => {
        // Handle both cases: userId as ObjectId or populated user object
        const participantId = p.userId._id || p.userId;
        return String(participantId) !== String(currentUserId);
      }
    );
  };

  const formatLastMessage = (message) => {
    if (!message) return 'No messages yet';
    
    switch (message.messageType) {
      case 'text':
        return message.content.text;
      case 'image':
        return '📷 Image';
      case 'voice':
        return '🎤 Voice message';
      case 'video_call':
        return '📹 Video call';
      case 'file':
        return '📎 File';
      default:
        return 'Message';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 168) { // 7 days
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getUnreadCount = (conversation) => {
    // This would need to be calculated based on last seen timestamps
    // For now, we'll return 0
    return 0;
  };

  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle size={48} className={`mx-auto mb-4 ${theme.text} opacity-50`} />
          <p className={`${theme.text} opacity-70`}>No conversations yet</p>
          <p className={`text-sm ${theme.text} opacity-50`}>
            Start a conversation with a {user?.type === 'patient' ? 'provider' : 'patient'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversation) => {
        const otherParticipant = getOtherParticipant(conversation);
        const unreadCount = getUnreadCount(conversation);
        
        return (
          <div
            key={conversation._id}
            onClick={() => onSelectConversation(conversation)}
            className={`p-4 border-b ${theme.accent} hover:bg-opacity-20 cursor-pointer transition-colors`}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {otherParticipant?.userId?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>

              {/* Conversation info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-semibold truncate ${theme.text}`}>
                    {otherParticipant?.userId?.name || 'Unknown User'}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${theme.secondaryText}`}>
                      {formatTime(conversation.lastMessageAt)}
                    </span>
                    {unreadCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className={`text-sm truncate ${theme.secondaryText}`}>
                    {formatLastMessage(conversation.lastMessage)}
                  </p>
                  
                  {/* Action buttons */}
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartVideoCall(conversation);
                      }}
                      className={`p-1 rounded hover:bg-opacity-20 transition-colors ${theme.accent}`}
                      title="Video call"
                    >
                      <Video size={14} className={theme.text} />
                    </button>
                  </div>
                </div>

                {/* User type indicator */}
                <div className="mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    otherParticipant?.userType === 'provider' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                  }`}>
                    {otherParticipant?.userType === 'provider' ? 'Provider' : 'Patient'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;

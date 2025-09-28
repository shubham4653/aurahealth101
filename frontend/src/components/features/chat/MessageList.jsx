import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';

const MessageList = ({ 
  messages, 
  currentUserId, 
  onReply, 
  onEdit, 
  onDelete, 
  onReaction,
  user 
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-500">No messages yet. Start the conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((message) => {
        // Handle both cases: senderId as ObjectId or populated user object
        const senderId = message.senderId._id || message.senderId;
        const isOwn = String(senderId) === String(currentUserId);
        
        return (
          <MessageItem
            key={message._id}
            message={message}
            isOwn={isOwn}
            onReply={onReply}
            onEdit={onEdit}
            onDelete={onDelete}
            onReaction={onReaction}
            user={user}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;

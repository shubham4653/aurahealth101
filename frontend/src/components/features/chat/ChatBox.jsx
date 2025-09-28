import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Phone, Video, MoreVertical } from 'lucide-react';
import { ThemeContext } from '../../../context/ThemeContext';
import { useContext } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import VideoCallModal from './VideoCallModal';
import { 
  sendMessage, 
  getMessages, 
  markAsRead,
  updateMessage,
  deleteMessage,
  addReaction 
} from '../../../api/chat';

const ChatBox = ({ 
  conversation, 
  currentUserId, 
  onBack, 
  onStartVideoCall,
  user 
}) => {
  const { theme } = useContext(ThemeContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const getOtherParticipant = () => {
    return conversation?.participants.find(
      p => {
        // Handle both cases: userId as ObjectId or populated user object
        const participantId = p.userId._id || p.userId;
        return String(participantId) !== String(currentUserId);
      }
    );
  };

  const otherParticipant = getOtherParticipant();

  useEffect(() => {
    if (conversation) {
      loadMessages();
      markMessagesAsRead();
    }
  }, [conversation]);

  const loadMessages = async (pageNum = 1, append = false) => {
    if (!conversation) return;
    
    setLoading(true);
    try {
      const response = await getMessages(conversation._id, pageNum, 50);
      if (response.success) {
        const newMessages = response.data;
        if (append) {
          setMessages(prev => [...newMessages, ...prev]);
        } else {
          setMessages(newMessages);
        }
        setHasMore(newMessages.length === 50);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    if (!conversation) return;
    
    try {
      await markAsRead(conversation._id);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleSendMessage = async (text) => {
    if (!conversation || !text.trim()) return;

    try {
      const messageData = {
        conversationId: conversation._id,
        messageType: 'text',
        content: { text },
        replyTo: replyTo?._id
      };

      const response = await sendMessage(messageData);
      if (response.success) {
        setMessages(prev => [...prev, response.data]);
        setReplyTo(null);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSendFile = async (file, messageType) => {
    if (!conversation || !file) return;

    try {
      const messageData = {
        conversationId: conversation._id,
        messageType,
        content: {}
      };

      const response = await sendMessage(messageData, file);
      if (response.success) {
        setMessages(prev => [...prev, response.data]);
      }
    } catch (error) {
      console.error('Error sending file:', error);
    }
  };

  const handleStartVoiceRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'voice-message.wav', { type: 'audio/wav' });
        
        try {
          const messageData = {
            conversationId: conversation._id,
            messageType: 'voice',
            content: { duration: 0 } // Duration will be calculated on backend
          };

          const response = await sendMessage(messageData, audioFile);
          if (response.success) {
            setMessages(prev => [...prev, response.data]);
          }
        } catch (error) {
          console.error('Error sending voice message:', error);
        }

        // Clean up
        stream.getTracks().forEach(track => track.stop());
        audioChunksRef.current = [];
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting voice recording:', error);
    }
  };

  const handleReply = (message) => {
    setReplyTo(message);
  };

  const handleEdit = (message) => {
    setEditingMessage(message);
  };

  const handleDelete = async (message) => {
    try {
      const response = await deleteMessage(message._id);
      if (response.success) {
        setMessages(prev => prev.filter(m => m._id !== message._id));
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleReaction = async (message, emoji) => {
    try {
      const response = await addReaction(message._id, emoji);
      if (response.success) {
        setMessages(prev => prev.map(m => 
          m._id === message._id ? response.data : m
        ));
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const handleStartVideoCall = () => {
    setShowVideoCall(true);
  };

  const loadMoreMessages = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadMessages(nextPage, true);
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
            <Phone size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500">Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className={`p-4 border-b ${theme.accent} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-opacity-20 transition-colors lg:hidden"
          >
            <ArrowLeft size={20} className={theme.text} />
          </button>
          
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            {otherParticipant?.userId?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          
          <div>
            <h2 className={`font-semibold ${theme.text}`}>
              {otherParticipant?.userId?.name || 'Unknown User'}
            </h2>
            <p className={`text-sm ${theme.secondaryText}`}>
              {otherParticipant?.userType === 'provider' ? 'Provider' : 'Patient'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStartVideoCall}
            className={`p-2 rounded-lg hover:bg-opacity-20 transition-colors ${theme.accent}`}
            title="Video call"
          >
            <Video size={20} className={theme.text} />
          </button>
          
          <button
            className={`p-2 rounded-lg hover:bg-opacity-20 transition-colors ${theme.accent}`}
          >
            <MoreVertical size={20} className={theme.text} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        onReply={handleReply}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReaction={handleReaction}
        user={user}
      />

      {/* Chat input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onSendFile={handleSendFile}
        onStartVoiceRecording={handleStartVoiceRecording}
        onStartVideoCall={handleStartVideoCall}
        isRecording={isRecording}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />

      {/* Video Call Modal */}
      <VideoCallModal
        isOpen={showVideoCall}
        onClose={() => setShowVideoCall(false)}
        conversation={conversation}
        currentUserId={currentUserId}
        user={user}
      />
    </div>
  );
};

export default ChatBox;

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
  const [callAccepted, setCallAccepted] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
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

  // Real-time message polling
  useEffect(() => {
    if (!conversation) return;

    const pollForNewMessages = async () => {
      try {
        const response = await getMessages(conversation._id, 1, 50);
        if (response.success) {
          const newMessages = response.data;
          setMessages(prev => {
            // Check if there are new messages
            const latestMessage = newMessages[newMessages.length - 1];
            const hasNewMessage = !prev.find(msg => msg._id === latestMessage?._id);
            
            if (hasNewMessage && latestMessage) {
              return newMessages;
            }
            return prev;
          });
        }
      } catch (error) {
        console.error('Error polling for messages:', error);
      }
    };

    // Poll every 2 seconds for new messages
    const interval = setInterval(pollForNewMessages, 2000);
    
    return () => clearInterval(interval);
  }, [conversation]);

  // Listen for video call join events
  useEffect(() => {
    const handleJoinVideoCall = (event) => {
      const { message, conversationId } = event.detail;
      console.log('Join video call event received:', {
        conversationId,
        currentConversationId: conversation._id,
        match: conversationId === conversation._id
      });
      
      if (conversationId === conversation._id) {
        console.log('Opening video call modal...');
        setShowVideoCall(true);
        setCallAccepted(false); // Reset call accepted state
        setCallConnected(false); // Reset call connected state
      }
    };

    window.addEventListener('joinVideoCall', handleJoinVideoCall);
    return () => window.removeEventListener('joinVideoCall', handleJoinVideoCall);
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
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      const startTime = Date.now();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const duration = Math.round((Date.now() - startTime) / 1000);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `voice-message-${Date.now()}.webm`, { 
          type: 'audio/webm' 
        });
        
        try {
          const messageData = {
            conversationId: conversation._id,
            messageType: 'voice',
            content: { duration }
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
        setIsRecording(false);
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting voice recording:', error);
      alert('Unable to access microphone. Please check permissions.');
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

  const sendCallStatusUpdate = async (status) => {
    try {
      // Prevent duplicate "accepted" messages
      if (status === 'accepted' && callAccepted) {
        return;
      }

      const callMessage = {
        conversationId: conversation._id,
        messageType: 'video_call',
        content: {
          callStatus: status,
          callType: 'video',
          message: status === 'accepted' ? `${user.name} joined the video call` :
                   status === 'ended' ? `${user.name} ended the video call` :
                   `${user.name} ${status} the video call`
        }
      };

      const response = await sendMessage(callMessage);
      if (response.success) {
        setMessages(prev => [...prev, response.data]);
        if (status === 'accepted') {
          setCallAccepted(true);
        }
      }
    } catch (error) {
      console.error('Error sending call status update:', error);
    }
  };

  const handleStartVideoCall = async () => {
    try {
      // Generate a unique room ID for this call
      const roomId = `call_${conversation._id}_${Date.now()}`;
      
      // Send video call notification message
      const callMessage = {
        conversationId: conversation._id,
        messageType: 'video_call',
        content: {
          callStatus: 'initiated',
          callType: 'video',
          message: `${user.name} started a video call. Click to join!`,
          roomId: roomId
        }
      };

      const response = await sendMessage(callMessage);
      if (response.success) {
        setMessages(prev => [...prev, response.data]);
      }

      // Open video call modal with room ID
      setShowVideoCall(true);
    } catch (error) {
      console.error('Error sending video call notification:', error);
      // Still open the video call modal even if notification fails
      setShowVideoCall(true);
    }
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
        onClose={() => {
          // Only send call ended notification if call was actually connected
          if (callConnected) {
            sendCallStatusUpdate('ended');
          }
          setShowVideoCall(false);
          setCallAccepted(false);
          setCallConnected(false);
        }}
        onCallAccepted={() => {
          if (!callAccepted) {
            sendCallStatusUpdate('accepted');
            setCallAccepted(true);
          }
        }}
        onCallConnected={() => {
          setCallConnected(true); // Mark call as connected when video starts
        }}
        conversation={conversation}
        currentUserId={currentUserId}
        user={user}
      />
    </div>
  );
};

export default ChatBox;

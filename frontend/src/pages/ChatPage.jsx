import React, { useState, useEffect } from 'react';
import { MessageCircle, Search, Plus } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { useContext } from 'react';
import GlassCard from '../components/ui/GlassCard';
import ConversationList from '../components/features/chat/ConversationList';
import ChatBox from '../components/features/chat/ChatBox';
import { getConversations, getOrCreateConversation } from '../api/chat';
import { getAllPatients } from '../api/patients';
import { getAllProviders } from '../api/appointments';

const ChatPage = ({ user }) => {
  const { theme } = useContext(ThemeContext);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserList, setShowUserList] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const response = await getConversations();
      if (response.success) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      let response;
      if (user.type === 'patient') {
        response = await getAllProviders();
      } else {
        response = await getAllPatients();
      }
      
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleStartConversation = async (userId) => {
    try {
      const participantType = user.type === 'patient' ? 'provider' : 'patient';
      const response = await getOrCreateConversation(userId, participantType);
      
      if (response.success) {
        setSelectedConversation(response.data);
        setShowUserList(false);
        loadConversations(); // Refresh conversations list
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const handleStartVideoCall = (conversation) => {
    // This will be implemented with ZegoCloud integration
    console.log('Starting video call with:', conversation);
    // TODO: Implement ZegoCloud video calling
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${theme.text}`}>Messages</h1>
            <p className={`opacity-80 ${theme.text}`}>
              Chat with {user.type === 'patient' ? 'your healthcare providers' : 'your patients'}
            </p>
          </div>
          
          <button
            onClick={() => {
              setShowUserList(true);
              loadUsers();
            }}
            className="p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Conversations sidebar */}
        <div className={`w-full lg:w-1/3 border-r ${theme.accent} flex flex-col`}>
          {/* Search */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.accent} ${theme.text}`}
              />
            </div>
          </div>

          {/* Conversations list */}
          <div className="flex-1 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className={theme.text}>Loading conversations...</p>
                </div>
              </div>
            ) : (
              <ConversationList
                conversations={conversations}
                currentUserId={user._id}
                onSelectConversation={handleSelectConversation}
                onStartVideoCall={handleStartVideoCall}
                user={user}
              />
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          <ChatBox
            conversation={selectedConversation}
            currentUserId={user._id}
            onBack={() => setSelectedConversation(null)}
            onStartVideoCall={handleStartVideoCall}
            user={user}
          />
        </div>
      </div>

      {/* User selection modal */}
      {showUserList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <GlassCard className="w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${theme.text}`}>
                  Start New Chat
                </h3>
                <button
                  onClick={() => setShowUserList(false)}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <input
                type="text"
                placeholder={`Search ${user.type === 'patient' ? 'providers' : 'patients'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.accent} ${theme.text}`}
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {loadingUsers ? (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className={theme.text}>Loading users...</p>
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="space-y-2">
                  {filteredUsers.map((userItem) => (
                    <button
                      key={userItem._id}
                      onClick={() => handleStartConversation(userItem._id)}
                      className={`w-full p-3 rounded-lg text-left hover:bg-opacity-20 transition-colors ${theme.accent}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                          {userItem.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className={`font-semibold ${theme.text}`}>
                            {userItem.name || 'Unknown User'}
                          </p>
                          <p className={`text-sm ${theme.secondaryText}`}>
                            {userItem.email}
                          </p>
                          {userItem.specialty && (
                            <p className={`text-xs ${theme.secondaryText}`}>
                              {userItem.specialty}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle size={48} className={`mx-auto mb-4 ${theme.text} opacity-50`} />
                  <p className={`${theme.text} opacity-70`}>
                    No {user.type === 'patient' ? 'providers' : 'patients'} found
                  </p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default ChatPage;

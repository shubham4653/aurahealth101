import React, { useState, useEffect, useRef } from 'react';
import { Phone, Video, Mic, MicOff, VideoOff, X } from 'lucide-react';
import { ThemeContext } from '../../../context/ThemeContext';
import { useContext } from 'react';

const VideoCallModal = ({ 
  isOpen, 
  onClose, 
  conversation, 
  currentUserId,
  user 
}) => {
  const { theme } = useContext(ThemeContext);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState('connecting'); // connecting, ringing, connected, ended
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const zegoEngineRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      initializeZegoCloud();
    } else {
      cleanup();
    }

    return () => cleanup();
  }, [isOpen]);

  const initializeZegoCloud = async () => {
    try {
      // ZegoCloud initialization
      // Note: You'll need to install @zegocloud/zego-express-engine-webrtc
      // npm install @zegocloud/zego-express-engine-webrtc
      
      // For now, we'll simulate the video call functionality
      console.log('Initializing ZegoCloud for video call...');
      
      // Simulate connection process
      setCallStatus('ringing');
      
      setTimeout(() => {
        setCallStatus('connected');
        setIsConnected(true);
        startCallTimer();
      }, 3000);

      // TODO: Replace with actual ZegoCloud implementation
      /*
      import { ZegoExpressEngine } from 'zego-express-engine-webrtc';
      
      const appID = process.env.REACT_APP_ZEGO_APP_ID;
      const appSign = process.env.REACT_APP_ZEGO_APP_SIGN;
      
      zegoEngineRef.current = new ZegoExpressEngine(appID, appSign);
      
      // Set up event handlers
      zegoEngineRef.current.on('roomStateUpdate', (roomID, state, error, extendedData) => {
        if (state === 'CONNECTED') {
          setCallStatus('connected');
          setIsConnected(true);
          startCallTimer();
        }
      });
      
      zegoEngineRef.current.on('roomUserUpdate', (roomID, updateType, userList) => {
        // Handle user join/leave
      });
      
      zegoEngineRef.current.on('remoteUserStateUpdate', (roomID, userID, state) => {
        // Handle remote user state changes
      });
      
      // Login to room
      const roomID = `room_${conversation._id}`;
      const userID = currentUserId;
      const userName = user.name;
      
      await zegoEngineRef.current.loginRoom(roomID, { userID, userName });
      */
      
    } catch (error) {
      console.error('Error initializing ZegoCloud:', error);
      setCallStatus('ended');
    }
  };

  const startCallTimer = () => {
    intervalRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const cleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (zegoEngineRef.current) {
      // zegoEngineRef.current.logoutRoom();
      // zegoEngineRef.current.destroyEngine();
    }
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setIsConnected(false);
    cleanup();
    onClose();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // TODO: Implement actual mute functionality with ZegoCloud
    // zegoEngineRef.current?.muteMicrophone(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    // TODO: Implement actual video toggle with ZegoCloud
    // zegoEngineRef.current?.enableCamera(!isVideoOff);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Video Call with {otherParticipant?.userId?.name || 'Unknown User'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {callStatus === 'connecting' && 'Connecting...'}
              {callStatus === 'ringing' && 'Ringing...'}
              {callStatus === 'connected' && `Connected - ${formatDuration(callDuration)}`}
              {callStatus === 'ended' && 'Call ended'}
            </p>
          </div>
          <button
            onClick={handleEndCall}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Video Area */}
        <div className="flex-1 relative bg-gray-900">
          {/* Remote Video */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isVideoOff ? (
              <div className="w-32 h-32 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-white text-2xl font-semibold">
                  {otherParticipant?.userId?.name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
            ) : (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                style={{ display: isVideoOff ? 'none' : 'block' }}
              />
            )}
          </div>

          {/* Local Video */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden">
            {isVideoOff ? (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white text-lg font-semibold">
                  {user.name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
            ) : (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ display: isVideoOff ? 'none' : 'block' }}
              />
            )}
          </div>

          {/* Connection Status Overlay */}
          {callStatus === 'connecting' && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p>Connecting...</p>
              </div>
            </div>
          )}

          {callStatus === 'ringing' && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 border-4 border-white rounded-full animate-pulse mx-auto mb-4"></div>
                <p>Ringing...</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-6 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={toggleMute}
              className={`p-4 rounded-full transition-colors ${
                isMuted 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>

            <button
              onClick={handleEndCall}
              className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              <Phone size={24} />
            </button>

            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-colors ${
                isVideoOff 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;

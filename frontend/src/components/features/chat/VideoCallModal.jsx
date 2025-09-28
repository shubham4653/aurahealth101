import React, { useState, useEffect, useRef } from 'react';
import { Phone, Video, Mic, MicOff, VideoOff, X } from 'lucide-react';
import { ThemeContext } from '../../../context/ThemeContext';
import { useContext } from 'react';

const VideoCallModal = ({ 
  isOpen, 
  onClose, 
  onCallAccepted,
  onCallConnected,
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
      console.log('Initializing video call...');
      setCallStatus('connecting');
      
      // Try to request camera and microphone access, but don't fail if it doesn't work
      let stream = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        // Set local video stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        // Store stream for cleanup
        zegoEngineRef.current = stream;
        
        console.log('Camera and microphone access granted');
      } catch (mediaError) {
        console.warn('Camera/microphone access denied or failed:', mediaError);
        // Continue without camera/microphone - user can enable later
        zegoEngineRef.current = null;
      }
      
      // Simulate connection process
      setCallStatus('ringing');
      
      setTimeout(() => {
        setCallStatus('connected');
        setIsConnected(true);
        startCallTimer();
        
        // Trigger call accepted event (only once)
        if (onCallAccepted) {
          onCallAccepted();
        }
        
        // Trigger call connected event
        if (onCallConnected) {
          onCallConnected();
        }
        
        // For demo purposes, we'll use the same stream for remote video
        // In a real implementation, this would come from the other participant
        if (remoteVideoRef.current && stream) {
          // Create a clone of the stream for remote video (demo only)
          const remoteStream = stream.clone();
          remoteVideoRef.current.srcObject = remoteStream;
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error initializing video call:', error);
      setCallStatus('ended');
      alert('Error initializing video call. Please try again.');
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
    
    // Stop all media tracks
    if (zegoEngineRef.current && zegoEngineRef.current.getTracks) {
      zegoEngineRef.current.getTracks().forEach(track => {
        track.stop();
      });
    }
    
    // Clear video refs
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setIsConnected(false);
    cleanup();
    onClose();
  };

  const enableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      // Set local video stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Store stream for cleanup
      zegoEngineRef.current = stream;
      setIsVideoOff(false);
      setIsMuted(false);
      
      console.log('Camera and microphone enabled');
    } catch (error) {
      console.error('Error enabling camera:', error);
      alert('Unable to access camera/microphone. Please check permissions.');
    }
  };

  const toggleMute = async () => {
    // If no stream exists, try to enable camera first
    if (!zegoEngineRef.current) {
      await enableCamera();
      return;
    }
    
    setIsMuted(!isMuted);
    
    // Toggle audio tracks
    if (zegoEngineRef.current && zegoEngineRef.current.getAudioTracks) {
      zegoEngineRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted; // Enable when currently muted, disable when not muted
      });
    }
  };

  const toggleVideo = async () => {
    // If no stream exists, try to enable camera first
    if (!zegoEngineRef.current) {
      await enableCamera();
      return;
    }
    
    setIsVideoOff(!isVideoOff);
    
    // Toggle video tracks
    if (zegoEngineRef.current && zegoEngineRef.current.getVideoTracks) {
      zegoEngineRef.current.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff; // Enable when currently off, disable when on
      });
    }
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
            {isVideoOff || !zegoEngineRef.current ? (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <span className="text-white text-lg font-semibold mb-2">
                  {user.name?.charAt(0)?.toUpperCase() || '?'}
                </span>
                {!zegoEngineRef.current && (
                  <button
                    onClick={enableCamera}
                    className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    Enable Camera
                  </button>
                )}
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

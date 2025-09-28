import React, { useState, useRef, useEffect } from 'react';
import { 
  MoreVertical, 
  Reply, 
  Edit, 
  Trash2, 
  Download,
  Play,
  Pause,
  Volume2,
  Video,
  Phone
} from 'lucide-react';
import { ThemeContext } from '../../../context/ThemeContext';
import { useContext } from 'react';

const MessageItem = ({ 
  message, 
  isOwn, 
  onReply, 
  onEdit, 
  onDelete, 
  onReaction,
  user 
}) => {
  const { theme } = useContext(ThemeContext);
  const [showMenu, setShowMenu] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAudioPlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderMessageContent = () => {
    switch (message.messageType) {
      case 'text':
        return (
          <div className={`p-3 rounded-lg max-w-xs lg:max-w-md ${
            isOwn ? 'bg-blue-600 text-white' : `${theme.secondary} ${theme.text}`
          }`}>
            {message.replyTo && (
              <div className={`mb-2 p-2 rounded border-l-4 ${
                isOwn ? 'bg-blue-500/30 border-blue-300' : 'bg-gray-200 border-gray-400'
              }`}>
                <p className="text-xs opacity-70">
                  Replying to {message.replyTo.senderId?.name}
                </p>
                <p className="text-sm truncate">
                  {message.replyTo.content?.text || 'Media message'}
                </p>
              </div>
            )}
            <p className="whitespace-pre-wrap">{message.content.text}</p>
            {message.isEdited && (
              <p className="text-xs opacity-70 mt-1">(edited)</p>
            )}
          </div>
        );

      case 'image':
        return (
          <div className="max-w-xs lg:max-w-md">
            <img 
              src={message.content.mediaUrl} 
              alt="Shared image"
              className="rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(message.content.mediaUrl, '_blank')}
            />
            {message.content.fileName && (
              <p className="text-xs opacity-70 mt-1">{message.content.fileName}</p>
            )}
          </div>
        );

      case 'voice':
        return (
          <div className={`p-3 rounded-lg max-w-xs ${
            isOwn ? 'bg-blue-600 text-white' : `${theme.secondary} ${theme.text}`
          }`}>
            <div className="flex items-center gap-3">
              <button
                onClick={handleAudioPlay}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Volume2 size={14} />
                  <span className="text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-1">
                  <div 
                    className="bg-white h-1 rounded-full transition-all"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <audio
              ref={audioRef}
              src={message.content.mediaUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
            />
          </div>
        );

      case 'video_call':
        return (
          <div className={`p-3 rounded-lg max-w-xs ${
            isOwn ? 'bg-green-600 text-white' : `${theme.secondary} ${theme.text}`
          }`}>
            <div className="flex items-center gap-3">
              <Video size={20} />
              <div>
                <p className="font-semibold">
                  {message.callData.callStatus === 'initiated' ? 'Video call initiated' :
                   message.callData.callStatus === 'answered' ? 'Video call answered' :
                   message.callData.callStatus === 'ended' ? 'Video call ended' :
                   'Video call missed'}
                </p>
                {message.callData.callDuration && (
                  <p className="text-sm opacity-70">
                    Duration: {formatTime(message.callData.callDuration)}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 'file':
        return (
          <div className={`p-3 rounded-lg max-w-xs ${
            isOwn ? 'bg-blue-600 text-white' : `${theme.secondary} ${theme.text}`
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded">
                <Download size={16} />
              </div>
              <div className="flex-1">
                <p className="font-semibold truncate">{message.content.fileName}</p>
                <p className="text-sm opacity-70">
                  {formatFileSize(message.content.fileSize)}
                </p>
              </div>
              <a
                href={message.content.mediaUrl}
                download={message.content.fileName}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <Download size={14} />
              </a>
            </div>
          </div>
        );

      default:
        return <p>Unsupported message type</p>;
    }
  };

  return (
    <div className={`flex gap-2 mb-4 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && (
          <p className="text-xs opacity-70 mb-1">{message.senderId?.name}</p>
        )}
        
        <div className="relative group">
          {renderMessageContent()}
          
          {/* Message menu */}
          <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`p-1 rounded-full hover:bg-white/20 transition-colors ${
                  isOwn ? 'text-white' : theme.text
                }`}
              >
                <MoreVertical size={14} />
              </button>
              
              {showMenu && (
                <div className={`absolute top-6 right-0 py-1 rounded-lg shadow-lg z-10 ${
                  isOwn ? 'bg-blue-600' : theme.secondary
                }`}>
                  <button
                    onClick={() => {
                      onReply(message);
                      setShowMenu(false);
                    }}
                    className={`w-full px-3 py-1 text-left text-sm hover:bg-white/20 flex items-center gap-2 ${
                      isOwn ? 'text-white' : theme.text
                    }`}
                  >
                    <Reply size={14} />
                    Reply
                  </button>
                  
                  {isOwn && message.messageType === 'text' && (
                    <button
                      onClick={() => {
                        onEdit(message);
                        setShowMenu(false);
                      }}
                      className={`w-full px-3 py-1 text-left text-sm hover:bg-white/20 flex items-center gap-2 ${
                        isOwn ? 'text-white' : theme.text
                      }`}
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                  )}
                  
                  {isOwn && (
                    <button
                      onClick={() => {
                        onDelete(message);
                        setShowMenu(false);
                      }}
                      className={`w-full px-3 py-1 text-left text-sm hover:bg-white/20 flex items-center gap-2 text-red-400`}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex gap-1 mt-1">
            {message.reactions.map((reaction, index) => (
              <button
                key={index}
                onClick={() => onReaction(message, reaction.emoji)}
                className="text-xs px-2 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                {reaction.emoji}
              </button>
            ))}
          </div>
        )}

        <p className="text-xs opacity-70 mt-1">
          {new Date(message.createdAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
          {message.status === 'read' && isOwn && (
            <span className="ml-1">✓✓</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default MessageItem;

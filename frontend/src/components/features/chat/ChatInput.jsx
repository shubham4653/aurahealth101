import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Image, 
  Mic, 
  Video, 
  Smile, 
  Paperclip,
  X
} from 'lucide-react';
import { ThemeContext } from '../../../context/ThemeContext';
import { useContext } from 'react';

const ChatInput = ({ 
  onSendMessage, 
  onSendFile, 
  onStartVoiceRecording,
  onStartVideoCall,
  isRecording,
  replyTo,
  onCancelReply,
  disabled = false 
}) => {
  const { theme } = useContext(ThemeContext);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        onSendFile(file, 'image');
      } else {
        onSendFile(file, 'file');
      }
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      // Stop recording logic will be handled by parent
    } else {
      onStartVoiceRecording();
    }
  };

  return (
    <div className={`border-t ${theme.accent} p-4`}>
      {/* Reply preview */}
      {replyTo && (
        <div className={`mb-3 p-3 rounded-lg ${theme.secondary} border-l-4 border-blue-500`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-500">
                Replying to {replyTo.senderId?.name}
              </p>
              <p className="text-sm opacity-70 truncate">
                {replyTo.content?.text || 'Media message'}
              </p>
            </div>
            <button
              onClick={onCancelReply}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {/* File input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*,.pdf,.doc,.docx,.txt"
          className="hidden"
        />

        {/* Emoji picker */}
        <div className="relative" ref={emojiPickerRef}>
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-2 rounded-lg hover:bg-opacity-20 transition-colors ${theme.accent}`}
            disabled={disabled}
          >
            <Smile size={20} className={theme.text} />
          </button>

          {showEmojiPicker && (
            <div className={`absolute bottom-12 left-0 w-64 h-48 overflow-y-auto p-3 rounded-lg shadow-lg z-10 ${theme.secondary} border ${theme.accent}`}>
              <div className="grid grid-cols-8 gap-1">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleEmojiSelect(emoji)}
                    className="p-1 hover:bg-white/20 rounded transition-colors text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className={`w-full p-3 pr-12 rounded-lg resize-none border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.accent} ${theme.text}`}
            rows={1}
            disabled={disabled}
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          
          {/* Action buttons */}
          <div className="absolute right-2 bottom-2 flex gap-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`p-1 rounded hover:bg-opacity-20 transition-colors ${theme.accent}`}
              disabled={disabled}
            >
              <Paperclip size={16} className={theme.text} />
            </button>
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`p-1 rounded hover:bg-opacity-20 transition-colors ${theme.accent}`}
              disabled={disabled}
            >
              <Image size={16} className={theme.text} />
            </button>
          </div>
        </div>

        {/* Voice recording button */}
        <button
          type="button"
          onClick={handleVoiceToggle}
          className={`p-2 rounded-lg hover:bg-opacity-20 transition-colors ${
            isRecording ? 'bg-red-500 text-white' : theme.accent
          }`}
          disabled={disabled}
        >
          <Mic size={20} />
        </button>

        {/* Video call button */}
        <button
          type="button"
          onClick={onStartVideoCall}
          className={`p-2 rounded-lg hover:bg-opacity-20 transition-colors ${theme.accent}`}
          disabled={disabled}
        >
          <Video size={20} className={theme.text} />
        </button>

        {/* Send button */}
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={20} />
        </button>
      </form>

      {/* Recording indicator */}
      {isRecording && (
        <div className="mt-2 p-2 bg-red-500/20 rounded-lg flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-red-500">Recording... Click to stop</span>
        </div>
      )}
    </div>
  );
};

export default ChatInput;

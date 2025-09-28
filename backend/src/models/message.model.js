import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  senderType: {
    type: String,
    enum: ['patient', 'provider'],
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'voice', 'video_call', 'file'],
    default: 'text'
  },
  content: {
    text: {
      type: String,
      trim: true
    },
    // For media messages
    mediaUrl: {
      type: String
    },
    mediaType: {
      type: String // MIME type
    },
    fileName: {
      type: String
    },
    fileSize: {
      type: Number
    },
    duration: {
      type: Number // For voice messages in seconds
    }
  },
  // For video calls
  callData: {
    callId: {
      type: String
    },
    callStatus: {
      type: String,
      enum: ['initiated', 'answered', 'ended', 'missed']
    },
    callDuration: {
      type: Number // in seconds
    },
    zegoRoomId: {
      type: String
    }
  },
  // Message status
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  readBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId
    },
    userType: {
      type: String,
      enum: ['patient', 'provider']
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Reply to another message
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  // Message reactions
  reactions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId
    },
    userType: {
      type: String,
      enum: ['patient', 'provider']
    },
    emoji: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1, senderType: 1 });
messageSchema.index({ 'callData.callId': 1 });

// Virtual to get sender details
messageSchema.virtual('sender', {
  ref: function() {
    return this.senderType === 'patient' ? 'Patient' : 'Provider';
  },
  localField: 'senderId',
  foreignField: '_id',
  justOne: true
});

export const Message = mongoose.model('Message', messageSchema);

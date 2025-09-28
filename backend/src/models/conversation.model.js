import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    userType: {
      type: String,
      enum: ['patient', 'provider'],
      required: true
    },
    lastSeen: {
      type: Date,
      default: Date.now
    }
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // For medical context
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  subject: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
conversationSchema.index({ 'participants.userId': 1, 'participants.userType': 1 });
conversationSchema.index({ lastMessageAt: -1 });

// Virtual to get participant details
conversationSchema.virtual('participantDetails', {
  ref: function() {
    return this.participants[0].userType === 'patient' ? 'Patient' : 'Provider';
  },
  localField: 'participants.userId',
  foreignField: '_id',
  justOne: false
});

export const Conversation = mongoose.model('Conversation', conversationSchema);

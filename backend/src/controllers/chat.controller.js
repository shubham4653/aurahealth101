import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Conversation } from '../models/conversation.model.js';
import { Message } from '../models/message.model.js';
import { Patient } from '../models/patient.model.js';
import { Provider } from '../models/provider.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// Get or create conversation between patient and provider
const getOrCreateConversation = asyncHandler(async (req, res) => {
  const { participantId, participantType } = req.body;
  
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }
  
  const currentUserId = req.user._id;
  const currentUserType = req.user.type;

  if (!participantId || !participantType) {
    throw new ApiError(400, 'Participant ID and type are required');
  }
  
  if (participantType === currentUserType) {
    throw new ApiError(400, 'Cannot create conversation with same user type');
  }

  // Check if conversation already exists
  let conversation = await Conversation.findOne({
    $and: [
      { 
        participants: { 
          $elemMatch: { 
            userId: currentUserId, 
            userType: currentUserType 
          } 
        } 
      },
      { 
        participants: { 
          $elemMatch: { 
            userId: participantId, 
            userType: participantType 
          } 
        } 
      },
      { isActive: true }
    ]
  }).populate('lastMessage');

  if (!conversation) {
    // Create new conversation
    conversation = await Conversation.create({
      participants: [
        {
          userId: currentUserId,
          userType: currentUserType
        },
        {
          userId: participantId,
          userType: participantType
        }
      ]
    });
  }

  // Get participant details manually
  const populatedParticipants = [];
  for (let participant of conversation.participants) {
    let user;
    if (participant.userType === 'patient') {
      user = await Patient.findById(participant.userId).select('name email');
    } else {
      user = await Provider.findById(participant.userId).select('name email');
    }
    
    if (!user) {
      console.error('User not found for participant:', participant.userId, 'Type:', participant.userType);
      // Keep the original participant data if user not found
      populatedParticipants.push(participant.toObject());
    } else {
      populatedParticipants.push({
        ...participant.toObject(),
        userId: user
      });
    }
  }
  
  conversation.participants = populatedParticipants;
  return res.status(200).json(
    new ApiResponse(200, conversation, 'Conversation retrieved successfully')
  );
});

// Get all conversations for current user
const getConversations = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;
  const currentUserType = req.user.type;

  const conversations = await Conversation.find({
    'participants.userId': currentUserId,
    'participants.userType': currentUserType,
    isActive: true
  })
  .populate('lastMessage')
  .sort({ lastMessageAt: -1 });

  // Manually populate participant details
  const populatedConversations = [];
  for (let conversation of conversations) {
    const populatedParticipants = [];
    for (let participant of conversation.participants) {
      let user;
      if (participant.userType === 'patient') {
        user = await Patient.findById(participant.userId).select('name email');
      } else {
        user = await Provider.findById(participant.userId).select('name email');
      }
      
      populatedParticipants.push({
        ...participant.toObject(),
        userId: user || participant.userId // Fallback to original ID if user not found
      });
    }
    
    populatedConversations.push({
      ...conversation.toObject(),
      participants: populatedParticipants
    });
  }

  return res.status(200).json(
    new ApiResponse(200, populatedConversations, 'Conversations retrieved successfully')
  );
});

// Send a message
const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId, messageType, content, replyTo } = req.body;
  const senderId = req.user._id;
  const senderType = req.user.type;


  if (!conversationId || !messageType) {
    throw new ApiError(400, 'Conversation ID and message type are required');
  }

  // Parse content if it's a string (from FormData)
  let parsedContent = content;
  if (typeof content === 'string') {
    try {
      parsedContent = JSON.parse(content);
    } catch (error) {
      console.error('Error parsing content:', error);
      throw new ApiError(400, 'Invalid content format');
    }
  }

  // Verify conversation exists and user is participant
  const conversation = await Conversation.findOne({
    _id: conversationId,
    'participants.userId': senderId,
    'participants.userType': senderType,
    isActive: true
  });

  if (!conversation) {
    throw new ApiError(404, 'Conversation not found or access denied');
  }

  let messageData = {
    conversationId,
    senderId,
    senderType,
    messageType,
    content: {},
    replyTo
  };

  // Handle different message types
  if (messageType === 'text') {
    if (!parsedContent.text) {
      throw new ApiError(400, 'Text content is required');
    }
    messageData.content.text = parsedContent.text;
  } else if (['image', 'voice', 'file'].includes(messageType)) {
    if (!req.file) {
      throw new ApiError(400, 'File is required for this message type');
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.buffer, {
      folder: 'chat-media',
      resource_type: 'auto',
      public_id: `chat_${Date.now()}_${senderId}`,
      mimeType: req.file.mimetype
    });

    messageData.content.mediaUrl = uploadResult.secure_url;
    messageData.content.mediaType = req.file.mimetype;
    messageData.content.fileName = req.file.originalname;
    messageData.content.fileSize = req.file.size;

    if (messageType === 'voice' && parsedContent.duration) {
      messageData.content.duration = parsedContent.duration;
    }
  } else if (messageType === 'video_call') {
    messageData.callData = parsedContent.callData || {};
    messageData.content.callStatus = parsedContent.callStatus || 'initiated'; // initiated, accepted, declined, ended
    messageData.content.callType = parsedContent.callType || 'video'; // video, audio
  }

  // Create message
  const message = await Message.create(messageData);

  // Update conversation last message
  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: message._id,
    lastMessageAt: new Date()
  });

  // Manually populate sender details
  let sender;
  if (senderType === 'patient') {
    sender = await Patient.findById(senderId).select('name email');
  } else {
    sender = await Provider.findById(senderId).select('name email');
  }
  
  const populatedMessage = {
    ...message.toObject(),
    senderId: sender || senderId // Fallback to original ID if sender not found
  };

  return res.status(201).json(
    new ApiResponse(201, populatedMessage, 'Message sent successfully')
  );
});

// Get messages for a conversation
const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { page = 1, limit = 50 } = req.query;
  const currentUserId = req.user._id;
  const currentUserType = req.user.type;

  // Verify conversation access
  const conversation = await Conversation.findOne({
    _id: conversationId,
    'participants.userId': currentUserId,
    'participants.userType': currentUserType,
    isActive: true
  });

  if (!conversation) {
    throw new ApiError(404, 'Conversation not found or access denied');
  }

  const skip = (page - 1) * limit;

  const messages = await Message.find({
    conversationId,
    isDeleted: false
  })
  .populate('replyTo')
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(parseInt(limit));

  // Manually populate senderId for each message
  const populatedMessages = [];
  for (let message of messages) {
    let sender;
    if (message.senderType === 'patient') {
      sender = await Patient.findById(message.senderId).select('name email');
    } else {
      sender = await Provider.findById(message.senderId).select('name email');
    }
    
    populatedMessages.push({
      ...message.toObject(),
      senderId: sender || message.senderId // Fallback to original ID if sender not found
    });
  }

  return res.status(200).json(
    new ApiResponse(200, populatedMessages.reverse(), 'Messages retrieved successfully')
  );
});

// Mark messages as read
const markAsRead = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const currentUserId = req.user._id;
  const currentUserType = req.user.type;

  // Update read status for unread messages
  await Message.updateMany(
    {
      conversationId,
      senderId: { $ne: currentUserId },
      'readBy.userId': { $ne: currentUserId }
    },
    {
      $push: {
        readBy: {
          userId: currentUserId,
          userType: currentUserType
        }
      },
      $set: {
        status: 'read'
      }
    }
  );

  // Update conversation last seen
  await Conversation.updateOne(
    {
      _id: conversationId,
      'participants.userId': currentUserId,
      'participants.userType': currentUserType
    },
    {
      $set: {
        'participants.$.lastSeen': new Date()
      }
    }
  );

  return res.status(200).json(
    new ApiResponse(200, {}, 'Messages marked as read')
  );
});

// Update message (edit)
const updateMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;
  const currentUserId = req.user._id;

  // Parse content if it's a string (from FormData)
  let parsedContent = content;
  if (typeof content === 'string') {
    try {
      parsedContent = JSON.parse(content);
    } catch (error) {
      console.error('Error parsing content in updateMessage:', error);
      throw new ApiError(400, 'Invalid content format');
    }
  }

  const message = await Message.findOne({
    _id: messageId,
    senderId: currentUserId,
    messageType: 'text',
    isDeleted: false
  });

  if (!message) {
    throw new ApiError(404, 'Message not found or cannot be edited');
  }

  message.content.text = parsedContent.text;
  message.isEdited = true;
  message.editedAt = new Date();

  await message.save();

  return res.status(200).json(
    new ApiResponse(200, message, 'Message updated successfully')
  );
});

// Delete message
const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const currentUserId = req.user._id;

  const message = await Message.findOne({
    _id: messageId,
    senderId: currentUserId,
    isDeleted: false
  });

  if (!message) {
    throw new ApiError(404, 'Message not found or cannot be deleted');
  }

  message.isDeleted = true;
  message.deletedAt = new Date();

  await message.save();

  return res.status(200).json(
    new ApiResponse(200, {}, 'Message deleted successfully')
  );
});

// Add reaction to message
const addReaction = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { emoji } = req.body;
  const currentUserId = req.user._id;
  const currentUserType = req.user.type;

  if (!emoji) {
    throw new ApiError(400, 'Emoji is required');
  }

  const message = await Message.findById(messageId);
  if (!message) {
    throw new ApiError(404, 'Message not found');
  }

  // Remove existing reaction from this user
  message.reactions = message.reactions.filter(
    reaction => !(reaction.userId.toString() === currentUserId.toString())
  );

  // Add new reaction
  message.reactions.push({
    userId: currentUserId,
    userType: currentUserType,
    emoji
  });

  await message.save();

  return res.status(200).json(
    new ApiResponse(200, message, 'Reaction added successfully')
  );
});

export {
  getOrCreateConversation,
  getConversations,
  sendMessage,
  getMessages,
  markAsRead,
  updateMessage,
  deleteMessage,
  addReaction
};

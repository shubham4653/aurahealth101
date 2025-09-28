import express from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWTPatient } from '../middlewares/authPatient.middleware.js';
import { verifyJWTProvider } from '../middlewares/authProvider.middleware.js';
import {
  getOrCreateConversation,
  getConversations,
  sendMessage,
  getMessages,
  markAsRead,
  updateMessage,
  deleteMessage,
  addReaction
} from '../controllers/chat.controller.js';

const router = express.Router();

// Middleware to set user type based on auth
const setUserType = (req, res, next) => {
  if (req.patient) {
    req.user = req.patient;
    req.user.type = 'patient';
  } else if (req.provider) {
    req.user = req.provider;
    req.user.type = 'provider';
  }
  next();
};

// Apply auth middleware and user type setting
const authMiddleware = (req, res, next) => {
  // Try patient auth first
  verifyJWTPatient(req, res, (err) => {
    if (!err && req.patient) {
      req.user = req.patient;
      req.user.type = 'patient';
      return next();
    }
    // If patient auth fails, try provider auth
    verifyJWTProvider(req, res, (err) => {
      if (!err && req.provider) {
        req.user = req.provider;
        req.user.type = 'provider';
        return next();
      }
      // Both auth methods failed
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access'
      });
    });
  });
};

router.use(authMiddleware);

// Conversation routes
router.post('/conversation', getOrCreateConversation);
router.get('/conversations', getConversations);

// Message routes
router.post('/message', upload.single('file'), sendMessage);
router.get('/messages/:conversationId', getMessages);
router.patch('/messages/:conversationId/read', markAsRead);
router.patch('/message/:messageId', updateMessage);
router.delete('/message/:messageId', deleteMessage);
router.post('/message/:messageId/reaction', addReaction);

export default router;

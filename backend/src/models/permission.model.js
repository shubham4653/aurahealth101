import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true, index: true },
  documentType: { type: String, default: 'All' },
  scope: { type: String, default: 'Full Record' },
  isActive: { type: Boolean, default: true, index: true },
}, { timestamps: true });

permissionSchema.index({ patientId: 1, providerId: 1 }, { unique: true });

export const Permission = mongoose.model('Permission', permissionSchema);



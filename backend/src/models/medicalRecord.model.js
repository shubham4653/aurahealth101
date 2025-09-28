import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema({
  // Basic record information
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true
  },
  recordType: {
    type: String,
    required: true,
    trim: true
  },
  fileName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // File storage information
  cloudinaryUrl: {
    type: String,
    required: true
  },
  cloudinaryPublicId: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  
  // Blockchain information
  contractAddress: {
    type: String,
    required: true,
    unique: true
  },
  recordIdHash: {
    type: String,
    required: true,
    unique: true
  },
  fileContentHash: {
    type: String,
    required: true
  },
  ipfsHash: {
    type: String,
    required: true
  },
  
  // Access control
  accessPermissions: [{
    providerAddress: {
      type: String,
      required: true
    },
    grantedAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Metadata
  uploadDate: {
    type: Date,
    default: Date.now
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
medicalRecordSchema.index({ patientId: 1, isActive: 1 });
medicalRecordSchema.index({ providerId: 1, isActive: 1 });
// Note: unique fields already create indexes for contractAddress and recordIdHash
medicalRecordSchema.index({ fileContentHash: 1 });

// Virtual for getting patient info
medicalRecordSchema.virtual('patient', {
  ref: 'Patient',
  localField: 'patientId',
  foreignField: '_id',
  justOne: true
});

// Virtual for getting provider info
medicalRecordSchema.virtual('provider', {
  ref: 'Provider',
  localField: 'providerId',
  foreignField: '_id',
  justOne: true
});

// Method to check if a provider has access
medicalRecordSchema.methods.hasProviderAccess = function(providerAddress) {
  return this.accessPermissions.some(
    permission => 
      permission.providerAddress.toLowerCase() === providerAddress.toLowerCase() && 
      permission.isActive
  );
};

// Method to grant access to a provider
medicalRecordSchema.methods.grantAccess = function(providerAddress) {
  const existingPermission = this.accessPermissions.find(
    p => p.providerAddress.toLowerCase() === providerAddress.toLowerCase()
  );
  
  if (existingPermission) {
    existingPermission.isActive = true;
    existingPermission.grantedAt = new Date();
  } else {
    this.accessPermissions.push({
      providerAddress,
      grantedAt: new Date(),
      isActive: true
    });
  }
  
  return this.save();
};

// Method to revoke access from a provider
medicalRecordSchema.methods.revokeAccess = function(providerAddress) {
  const permission = this.accessPermissions.find(
    p => p.providerAddress.toLowerCase() === providerAddress.toLowerCase()
  );
  
  if (permission) {
    permission.isActive = false;
    return this.save();
  }
  
  return Promise.resolve(this);
};

export const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
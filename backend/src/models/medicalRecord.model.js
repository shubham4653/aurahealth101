import mongoose, { Schema } from 'mongoose';


const medicalRecordSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient', 
      required: true,
      index: true, 
    },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: 'Provider', 
      required: true,
    },
    recordType: {
      type: String,
      required: true, 
      trim: true,
    },
    
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String, 
      required: true,
    },
    blockchainHash: {
      type: String,
      required: true,
      unique: true, 
    },
    accessGrantedTo: [{
      type: Schema.Types.ObjectId,
      ref: 'Provider',
    }],
  },
  {
    timestamps: true,
  }
);

export const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
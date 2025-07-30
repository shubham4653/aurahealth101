import mongoose, { Schema } from 'mongoose';


const appointmentSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient', 
      required: true,
    },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: 'Provider', 
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true, 
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'No Show'],
      default: 'Scheduled',
    },
    time : {
      type: String,
      required: true,
      trim: true, 
    },
  },
  {
    timestamps: true,
  }
);

export const Appointment = mongoose.model('Appointment', appointmentSchema);

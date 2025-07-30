import mongoose,{Schema} from 'mongoose';


const carePlanSchema = new Schema({
    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
        unique: true 
    },
    providerId: {
        type: Schema.Types.ObjectId,
        ref: 'Provider',
        required: true
    },
    tasks: [{ 
    taskName: { type: String, required: true },
    instructions: String,
    completed: { type: Boolean, default: false },
    }],
    medications: [{ 
        name: String, 
        dosage: String, 
        frequency: String,
        completed: { type: Boolean, default: false }
    }],
    

}, { timestamps: true });

export const CarePlan = mongoose.model('CarePlan', carePlanSchema);
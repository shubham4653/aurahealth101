import mongoose,{Schema} from 'mongoose';

const patientSchema = new Schema(
    {
    email: {
      type: String,
      required: true,
      unique: true,
    },   
    password: {type: String, required: true},   
    name: {type: String, required: true},   
    age: {type: Number, required: true},
    gender: {
        type: String, 
        enum: ['Male', 'Female', 'Other']
    },
    bloodgroup: {
        type: String, 
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    contact: {type: Number, required: true},
    address: {type: String, required: true},
    chroniccondition: {type: [String], default: []},
    allergies: {type: [String], default: []},
    emergencyContact: {
        name: String,
        relation: String,
        phone: String,
    },
    providers: [{
      type: Schema.Types.ObjectId,
      ref: 'Provider', 
    }],
    },
    {timestamps: true}
)


export const Patient = mongoose.model('Patient', patientSchema);
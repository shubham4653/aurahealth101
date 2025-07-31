import mongoose,{Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

patientSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hashSync(this.password, 10)
    next()
})

patientSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
    
}

patientSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id : this._id,
            name: this.name,
            email: this.email,  
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    )
}
patientSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id : this._id, 
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    )
}

export const Patient = mongoose.model('Patient', patientSchema);
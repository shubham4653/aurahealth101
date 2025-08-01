import mongoose,{Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const providerSchema = new Schema(
    {
    email: {type: String, required: true,unique: true},   
    password: {type: String, required: true},   
    name: {type: String, required: true},   
    age: {type: Number},
    gender: {
        type: String, 
        enum: ['Male', 'Female', 'Other']
    },
    specialty: {type: String,trim: true},
    licenseNumber: {type: String,unique: true,trim: true},
    qualifications: {type: [String],default: [],},
    hospitalAffiliation: {type: String,trim: true,},
    yearsOfExperience: {type: Number,min: 0,default: 0},
    patients: [{
      type: Schema.Types.ObjectId,
      ref: 'User', 
    }],
    },
    { timestamps: true }
)

providerSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hashSync(this.password, 10)
    next()
})

providerSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
    
}

providerSchema.methods.generateAccessToken = function() {
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
providerSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id : this._id, 
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    )
}

export const Provider = mongoose.model('Provider', providerSchema);
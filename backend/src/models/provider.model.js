import mongoose,{Schema} from 'mongoose';

const providerSchema = new Schema(
    {
    email: {type: String, required: true,unique: true},   
    password: {type: String, required: true},   
    name: {type: String, required: true},   
    age: {type: Number, required: true},
    gender: {type: String, required: true},
    specialty: {type: String,required: true,trim: true},
    licenseNumber: {type: String,required: true,unique: true,trim: true},
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


export const Provider = mongoose.model('Provider', providerSchema);
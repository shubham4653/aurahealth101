import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/apiError.js';
import {Patient} from '../models/patient.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerPatient = asyncHandler(async (req, res) => {
    //gets data from the frontend
    //validation - not empty
    //check if patient already exists : email
    //create patient object - create entry in db
    //remove password from the response and refresh roken
    //check if patient is created successfully
    //return response to the frontend

    console.log("📦 Received body:", req.body);
    const {name, email, password} = req.body || {}


    if(!name || !email || !password) {
        throw new ApiError(400, 'Please provide all the required fields')
    }

    const existedPatient = await Patient.findOne({email})

    if(existedPatient) {
        throw new ApiError(409, 'Patient already exists with this email')
    }

    const patient = await Patient.create({
        name,
        email,
        password
        })

    const createdPatient= await Patient.findById(patient._id).select(
        "-password -refreshToken"
    )       

    if(!createdPatient) {
        throw new ApiError(500, 'Patient not created')
    }

    return res.status(201).json(
        new ApiResponse(200,createdPatient, 'Patient registered successfully')
    )

})



export {registerPatient}

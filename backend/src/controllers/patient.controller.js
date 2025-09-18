import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';

import {Patient} from '../models/patient.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';


const generateAccessTokenAndRefreshTokens = async(PatientId) => {
    try {
        const user = await Patient.findById(PatientId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, 'Error generating tokens')
    }
}

const registerPatient = asyncHandler(async (req, res) => {
    //gets data from the frontend
    //validation - not empty
    //check if patient already exists : email
    //create patient object - create entry in db
    //remove password from the response and refresh roken
    //check if patient is created successfully
    //return response to the frontend

    //console.log("📦 Received body:", req.body);
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


const loginPatient = asyncHandler(async (req, res) => {
    //req body se data le aao   req body -> data
    //email based login
    //find the patient by email
    //password check
    //access and refresh token generate
    //send to cookie

    const {email, password} = req.body

    if(!email) {
        throw new ApiError(400, 'Please provide email')
    }
    if(!password) {
        throw new ApiError(400, 'Please provide password')
    }

    const patient = await Patient.findOne({email})

    if(!patient) {
        throw new ApiError(401, 'Invalid credentials')
    }


    const isPasswordValid = await patient.isPasswordCorrect(password)

    if(!isPasswordValid) {
        throw new ApiError(401, 'Invalid credentials')
    }

    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshTokens(patient._id)

    const loggedInPatient = await Patient.findById(patient._id).select(
        "-password -refreshToken"
    )


    const options = {
        httpOnly: true,
        secure : true
    }

    return res
    .status(200)
    .cookie('refreshToken', refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                patient: loggedInPatient,
                accessToken,
                refreshToken
            },
            "Patient logged in successfully"
        )
    )

})


const logoutPatient = asyncHandler(async (req, res) => {
    await Patient.findByIdAndUpdate(
        req.patient._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure : true
    }

    return res
    .status(200)
    .clearCookie('refreshToken', options)
    .json(
        new ApiResponse(200,{}, "Patient logged out successfully")
    )


})


const updatePatientProfile = asyncHandler(async (req, res) => {
    // Destructure all possible fields from the body
    const { name, phone, age, address, gender, bloodGroup, allergies, chronicConditions, emergencyContact } = req.body;

    // Build an update object with only the provided fields
    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.contact = phone;
    if (age) updateFields.age = age;
    if (address) updateFields.address = address;
    if (gender) updateFields.gender = gender;
    if (bloodGroup) updateFields.bloodgroup = bloodGroup;
    if (allergies) updateFields.allergies = allergies;
    if (chronicConditions) updateFields.chroniccondition = chronicConditions;
    if (emergencyContact) updateFields.emergencyContact = emergencyContact;


    // Check if there's anything to update
    if (Object.keys(updateFields).length === 0) {
        throw new ApiError(400, "No update data provided.");
    }

    const patient = await Patient.findByIdAndUpdate(
        req.patient._id,
        { $set: updateFields },
        { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!patient) {
        throw new ApiError(404, "Patient not found.");
    }

    // Map database field names to frontend-expected field names
    const mappedPatient = {
        ...patient.toObject(),
        phone: patient.contact, // Map contact to phone
        bloodGroup: patient.bloodgroup, // Map bloodgroup to bloodGroup
        chronicConditions: patient.chroniccondition, // Map chroniccondition to chronicConditions
    };

    // Remove the original database field names to avoid confusion
    delete mappedPatient.contact;
    delete mappedPatient.bloodgroup;
    delete mappedPatient.chroniccondition;

    return res
        .status(200)
        .json(new ApiResponse(200, mappedPatient, "Profile updated successfully."));
});


const getPatientProfile = asyncHandler(async (req, res) => {
    // The patient's data is attached to the request by the verifyJWTPatient middleware
    const patient = await Patient.findById(req.patient._id).select("-password -refreshToken");

    if (!patient) {
        throw new ApiError(404, "Patient not found.");
    }

    // Map database field names to frontend-expected field names
    const mappedPatient = {
        ...patient.toObject(),
        phone: patient.contact, // Map contact to phone
        bloodGroup: patient.bloodgroup, // Map bloodgroup to bloodGroup
        chronicConditions: patient.chroniccondition, // Map chroniccondition to chronicConditions
    };

    // Remove the original database field names to avoid confusion
    delete mappedPatient.contact;
    delete mappedPatient.bloodgroup;
    delete mappedPatient.chroniccondition;

    return res
        .status(200)
        .json(new ApiResponse(200, mappedPatient, "Patient profile fetched successfully."));
});


export {
    registerPatient,
    loginPatient,
    logoutPatient,
    updatePatientProfile,
    getPatientProfile
};

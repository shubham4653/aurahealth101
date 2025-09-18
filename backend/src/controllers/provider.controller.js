import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';

import {Provider} from '../models/provider.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';


const generateAccessTokenAndRefreshTokens = async(ProviderId) => {
    try {
        const user = await Provider.findById(ProviderId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, 'Error generating tokens')
    }
}


const registerProvider = asyncHandler(async (req, res) => {
    const {name, email, password, licenseNumber} = req.body 

    
    if(
        [name, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, 'Please provide all the required fields')
    }

    
        const existedProvider = await Provider.findOne({email})
    
        if(existedProvider) {
            throw new ApiError(409, 'Provider already exists with this email')
        }
    
        const providerData = {
            name,
            email,
            password,
        }

        if(licenseNumber){
            providerData.licenseNumber = licenseNumber
        }
    
        const provider = await Provider.create(providerData)


        const createdProvider = await Provider.findById(provider._id).select(
            "-password -refreshToken"
        ) 
    

        if(!createdProvider) {
            throw new ApiError(500, 'Provider not created')
        }

        return res.status(201).json(
            new ApiResponse(200, createdProvider, 'Provider registered successfully')
        )

})



const loginProvider = asyncHandler(async (req, res) => {
    
    const {email, password} = req.body

    if(!email) {
        throw new ApiError(400, 'Please provide email')
    }
    if(!password) {
        throw new ApiError(400, 'Please provide password')
    }

    const provider = await Provider.findOne({email})

    if(!provider) {
        throw new ApiError(401, 'Invalid credentials')
    }


    const isPasswordValid = await provider.isPasswordCorrect(password)

    if(!isPasswordValid) {
        throw new ApiError(401, 'Invalid credentials')
    }


    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshTokens(provider._id)
    
    // Fetch the latest provider profile after login
    const loggedInProvider = await Provider.findById(provider._id).select(
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
                provider: loggedInProvider,
                accessToken,
                refreshToken
            },
            "Provider logged in successfully"
        )
    )  

})

const logoutProvider = asyncHandler(async (req, res) => {
    await Provider.findByIdAndUpdate(
            req.provider._id,
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
            new ApiResponse(200,{}, "Provider logged out successfully")
        )

})

const getAllProviders = asyncHandler(async (req, res) => {
    const providers = await Provider.find({}).select('name specialty');
    return res
        .status(200)
        .json(new ApiResponse(200, providers, 'Providers fetched successfully'));
});




const updateProviderProfile = asyncHandler(async (req, res) => {
    const { name, specialty, qualifications, licenseNumber, yearsOfExperience, age, gender } = req.body;
    const updateFields = {};
    if (name) updateFields.name = name;
    if (specialty) updateFields.specialty = specialty;
    if (qualifications) updateFields.qualifications = qualifications;
    if (licenseNumber) updateFields.licenseNumber = licenseNumber;
    if (yearsOfExperience) updateFields.yearsOfExperience = yearsOfExperience;
    if (age) updateFields.age = age;
    if (gender) updateFields.gender = gender;

   
    // Filter out undefined fields to avoid overwriting with null
    // Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);

    if (Object.keys(updateFields).length === 0) {
        throw new ApiError(400, "No fields to update provided");
    }

    await Provider.findByIdAndUpdate(
        req.provider._id,
        { $set: updateFields },
        { new: true, runValidators: true }
    );

    // Fetch the updated provider profile
    const provider = await Provider.findById(req.provider._id).select("-password -refreshToken");

    if (!provider) {
        throw new ApiError(404, "Provider not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, provider, "Provider profile updated successfully"));
});


const getProviderProfile = asyncHandler(async (req, res) => {
    const provider = await Provider.findById(req.provider._id).select("-password -refreshToken");

    if (!provider) {
        throw new ApiError(404, "Provider not found.");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, provider, "Provider profile fetched successfully."));
});

export {
    registerProvider , 
    loginProvider,
    logoutProvider,
    getAllProviders,
    updateProviderProfile,
    getProviderProfile,
};

import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/apiError.js';
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
    const {name, email, password} = req.body 
        if(!name || !email || !password) {
            throw new ApiError(400, 'Please provide all the required fields')
        }
    
        const existedProvider = await Provider.findOne({email})
    
        if(existedProvider) {
            throw new ApiError(409, 'Provider already exists with this email')
        }
    
        const provider = await Provider.create({
            name,
            email,
            password
            })

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
        throw new ApiError(404, 'Provider not found')
    }

    const isPasswordValid = await provider.isPasswordCorrect(password)

    if(!isPasswordValid) {
        throw new ApiError(401, 'Invalid credentials')
    }


    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshTokens(provider._id)
    
        const loggedInProvider = await Provider.findById(provider._id).select(
            "-password -refreshToken"
        )
    
    
        const options = {
            httpOnly: true,
            secure : true
        }
    
        return res
        .status(200)
        .cookie('accessToken', accessToken, options)
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
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(
            new ApiResponse(200,{}, "Provider logged out successfully")
        )
})


export {
    registerProvider , 
    loginProvider,
    logoutProvider
};
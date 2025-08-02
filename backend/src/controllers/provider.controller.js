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

    const accessToken = provider.generateAccessToken()
    const refreshToken = provider.generateRefreshToken()

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    })

    return res.status(200).json(
        new ApiResponse(200, {accessToken}, 'Provider logged in successfully')
    )

})


export {registerProvider , loginProvider};
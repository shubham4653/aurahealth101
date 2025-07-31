import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/apiError.js';
import {Provider} from '../models/provider.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';


const registerProvider = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body
    
        if(!name || !email || !password) {
            throw new ApiError(400, 'Please provide all the required fields')
        }
    
        const existedProvider = Provider.findOne({email})
    
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


export {registerProvider}
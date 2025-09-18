import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import {Provider} from "../models/provider.model.js";

export const verifyJWTProvider = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new ApiError(401, "Unauthorized access, no token provided")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const provider = await Provider.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!provider) {
            throw new ApiError(401, "invalid access token")
        }
    
        req.provider = provider;
        next()
    } catch (error) {
        throw new ApiError(401,error.message || "Unauthorized access, invalid token")
    }
})

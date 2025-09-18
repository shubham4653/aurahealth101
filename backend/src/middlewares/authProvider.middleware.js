import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import {Provider} from "../models/provider.model.js";

export const verifyJWTProvider = asyncHandler(async (req, _, next) => {
    console.log("verifyJWTProvider middleware entered");
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        console.log("Token:", token);

    
        if (!token) {
            console.log("No token provided");
            throw new ApiError(401, "Unauthorized access, no token provided")
        }
    
        console.log("Token provided, verifying...");
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log("Decoded Token:", decodedToken);
    
        const provider = await Provider.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!provider) {
            console.log("Provider not found for decoded token");
            throw new ApiError(401, "invalid access token")
        }
    
        req.provider = provider;
        console.log("req.provider set:", req.provider);
        console.log("req.provider._id:", req.provider._id);
        console.log("Provider found, calling next()");
        next()
    } catch (error) {
        console.error("Error in verifyJWTProvider:", error.message);
        throw new ApiError(401,error.message || "Unauthorized access, invalid token")
    }
})

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import {Provider} from "../models/provider.model.js";

export const verifyJWTProvider = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        // console.log("🔍 Provider Auth Debug:", {
        //     hasToken: !!token,
        //     tokenLength: token?.length,
        //     authHeader: req.header("Authorization"),
        //     cookies: req.cookies
        // });
        
        if (!token) {
            throw new ApiError(401, "Unauthorized access, no token provided")
        }
        
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // console.log("🔍 Decoded token:", { id: decodedToken?._id, role: decodedToken?.role });
    
        const provider = await Provider.findById(decodedToken?._id).select("-password -refreshToken")
        // console.log("🔍 Provider found:", !!provider, provider?.email);
    
        if (!provider) {
            throw new ApiError(401, "invalid access token")
        }
    
        req.provider = provider;
        next()
    } catch (error) {
        console.error("🔍 Provider Auth Error:", error.message);
        throw new ApiError(401, error.message || "Unauthorized access, invalid token")
    }
})

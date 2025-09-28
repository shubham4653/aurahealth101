import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { Patient } from "../models/patient.model.js";

export const verifyJWTPatient = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        console.log("🔍 Patient Auth Debug:", {
            hasToken: !!token,
            tokenLength: token?.length,
            authHeader: req.header("Authorization"),
            cookies: req.cookies
        });
        
        if (!token) {
            throw new ApiError(401, "Unauthorized access, no token provided")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log("🔍 Decoded token:", { id: decodedToken?._id, role: decodedToken?.role });
    
        const patient = await Patient.findById(decodedToken?._id).select("-password -refreshToken")
        console.log("🔍 Patient found:", !!patient, patient?.email);
    
        if (!patient) {
            throw new ApiError(401, "invalid access token")
        }
    
        req.patient = patient;
        next()
    } catch (error) {
        console.error("🔍 Patient Auth Error:", error.message);
        throw new ApiError(401, error.message || "Unauthorized access, invalid token")
    }
})

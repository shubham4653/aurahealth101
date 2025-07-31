import {asyncHandler} from '../utils/asyncHandler.js';


const registerProvider = asyncHandler(async (req, res) => {
    res.status(200).json({
        message:"ok1"
    })
})


export {registerProvider}
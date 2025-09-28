import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET, 
});


const UploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) {
            throw new Error('No file path provided');
        }
        //upload file on cloudinary
        const response = await  cloudinary.uploader.upload(localFilePath,{
            resource_type: 'auto',
        })
        //file has been uploaded sucessfully
        console.log('File uploaded successfully', response.url)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) // delete the file from local storage
        console.error('Error uploading file to Cloudinary:', error)
        return null;
        
    }
}

const uploadToCloudinary = async (fileBuffer, options = {}) => {
    try {
        if (!fileBuffer) {
            throw new Error('No file buffer provided');
        }
        
        // Convert buffer to base64 string
        const base64String = fileBuffer.toString('base64');
        const dataURI = `data:${options.mimeType || 'application/octet-stream'};base64,${base64String}`;
        
        // Upload to Cloudinary
        const response = await cloudinary.uploader.upload(dataURI, {
            resource_type: 'auto',
            folder: options.folder || 'medical-records',
            public_id: options.public_id,
            ...options
        });
        
        console.log('File uploaded successfully to Cloudinary:', response.secure_url);
        return response;
    } catch (error) {
        console.error('Error uploading file to Cloudinary:', error);
        throw error;
    }
};

export { UploadOnCloudinary, uploadToCloudinary };
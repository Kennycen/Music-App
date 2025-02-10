import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

const connectCloudinary = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET_KEY
        })
        
        console.log('Cloudinary Connected')
        
        return new CloudinaryStorage({
            cloudinary: cloudinary,
            params: {
                folder: 'music-app',
                resource_type: 'auto',
                allowed_formats: ['mp3', 'wav'], // restrict to audio files
                transformation: [{ quality: 'auto' }]
            }
        })
    } catch (error) {
        console.error('Cloudinary configuration failed:', error)
        throw error
    }
}

// Add a function to delete files from Cloudinary
export const deleteFromCloudinary = async (cloudinaryId) => {
    try {
        if (!cloudinaryId) return
        const result = await cloudinary.uploader.destroy(cloudinaryId, { resource_type: 'video' })
        return result
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error)
        throw error
    }
}

export default connectCloudinary
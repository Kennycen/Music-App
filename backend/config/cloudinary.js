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
                allowed_formats: ['mp3', 'wav'] // restrict to audio files
            }
        })
    } catch (error) {
        console.error('Cloudinary configuration failed:', error)
        throw error
    }
}

export default connectCloudinary
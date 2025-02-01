import mongoose from 'mongoose'

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    artist: {
        type: String,
        required: false,
        trim: true,
        default: 'Unknown Artist'
    },
    audioUrl: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true,
        default: '0:00'
    },
    cloudinaryId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export default mongoose.model('Song', songSchema) 
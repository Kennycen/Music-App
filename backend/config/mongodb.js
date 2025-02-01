import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('DB Connected')
        })

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err)
        })

        await mongoose.connect(`${process.env.MONGODB_URI}/music-app`)
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error)
        process.exit(1)
    }
}

export default connectDB
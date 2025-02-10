import React, { useEffect, useCallback } from 'react'

const CloudinaryUploadWidget = ({ onUploadSuccess, onUploadError }) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    const createUploadWidget = useCallback(() => {
        return window.cloudinary.createUploadWidget(
            {
                cloudName: cloudName,
                uploadPreset: uploadPreset,
                sources: ['local'],
                multiple: false,
                maxFileSize: 25000000, // 25MB
                resourceType: 'video', // Changed to video for audio files
                folder: 'music-app',
                allowedFormats: ['mp3', 'wav'],
                // Add these optimization options
                clientAllowedFormats: ['mp3', 'wav'],
                maxChunkSize: 2000000, // 2MB chunks for faster upload
                // Add progress monitoring
                showUploadMoreButton: false,
                singleUploadAutoClose: false,
                showAdvancedOptions: false,
                styles: {
                    palette: {
                        window: "#FFFFFF",
                        windowBorder: "#90A0B3",
                        tabIcon: "#0078FF",
                        menuIcons: "#5A616A",
                        textDark: "#000000",
                        textLight: "#FFFFFF",
                        link: "#0078FF",
                        action: "#FF620C",
                        inactiveTabIcon: "#0E2F5A",
                        error: "#F44235",
                        inProgress: "#0078FF",
                        complete: "#20B832",
                        sourceBg: "#E4EBF1"
                    }
                }
            },
            (error, result) => {
                if (!error && result) {
                    switch (result.event) {
                        case 'success':
                            onUploadSuccess({
                                audioUrl: result.info.secure_url,
                                cloudinaryId: result.info.public_id,
                            })
                            break;
                        case 'progress':
                            console.log('Upload progress:', result.data.percent)
                            break;
                        case 'error':
                            onUploadError(result.error)
                            break;
                    }
                }
                if (error) {
                    console.error('Upload error:', error)
                    onUploadError(error)
                }
            }
        )
    }, [cloudName, uploadPreset, onUploadSuccess, onUploadError])

    useEffect(() => {
        const widget = createUploadWidget()
        // Cleanup
        return () => {
            if (widget) {
                widget.destroy()
            }
        }
    }, [createUploadWidget])

    return null
}

export default CloudinaryUploadWidget 
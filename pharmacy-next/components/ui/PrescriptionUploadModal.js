"use client"

import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, Upload, Loader2, FileImage, CheckCircle2, Camera } from 'lucide-react'
import toast from 'react-hot-toast'

const MAX_DIMENSION = 1280 // px — long-edge cap, keeps the compressed image sharp but small
const JPEG_QUALITY = 0.75

// Resizes/compresses an image file in the browser before it's ever turned into
// base64 — without this, a 12MP phone photo produces a multi-MB JSON payload
// that's slow to upload and can trip request-size limits.
function compressImage(file) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const objectUrl = URL.createObjectURL(file)

        img.onload = () => {
            URL.revokeObjectURL(objectUrl)

            let { width, height } = img
            if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                if (width > height) {
                    height = Math.round((height * MAX_DIMENSION) / width)
                    width = MAX_DIMENSION
                } else {
                    width = Math.round((width * MAX_DIMENSION) / height)
                    height = MAX_DIMENSION
                }
            }

            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, width, height)

            resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY))
        }
        img.onerror = () => {
            URL.revokeObjectURL(objectUrl)
            reject(new Error('Could not read image file'))
        }
        img.src = objectUrl
    })
}

export default function PrescriptionUploadModal({ isOpen, onClose, onUploaded, productName }) {
    const [preview, setPreview] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [compressedDataUrl, setCompressedDataUrl] = useState('')
    const fileInputRef = useRef(null)

    if (!isOpen) return null

    const reset = () => {
        setPreview('')
        setCompressedDataUrl('')
        setIsProcessing(false)
        setIsUploading(false)
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file')
            return
        }

        setIsProcessing(true)
        try {
            const dataUrl = await compressImage(file)
            setCompressedDataUrl(dataUrl)
            setPreview(dataUrl)
        } catch (error) {
            toast.error(error.message || 'Failed to process image')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleUpload = async () => {
        if (!compressedDataUrl) return

        setIsUploading(true)
        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: compressedDataUrl,
                    folder: 'hope-pharmacy/prescriptions',
                }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Upload failed')

            toast.success('Prescription uploaded!', { position: 'bottom-center' })
            onUploaded({ prescriptionUrl: data.url, prescriptionPublicId: data.publicId })
            reset()
            onClose()
        } catch (error) {
            toast.error(error.message || 'Failed to upload prescription')
        } finally {
            setIsUploading(false)
        }
    }

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10 cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6 md:p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-secondary mb-2">Upload Prescription</h2>
                        <p className="text-sm text-text-secondary">
                            {productName ? `A valid prescription is required for "${productName}"` : 'This item requires a valid prescription'}
                        </p>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handleFileSelect}
                    />

                    <label
                        onClick={(e) => { e.preventDefault(); fileInputRef.current?.click() }}
                        className="block border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary transition-colors cursor-pointer overflow-hidden"
                    >
                        {isProcessing ? (
                            <div className="py-8 flex flex-col items-center">
                                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                                <p className="text-xs text-text-secondary">Compressing image...</p>
                            </div>
                        ) : preview ? (
                            <img
                                src={preview}
                                alt="Prescription preview"
                                className="max-h-[220px] mx-auto rounded-lg object-contain w-auto h-auto"
                            />
                        ) : (
                            <div className="py-6">
                                <div className="flex items-center justify-center gap-3 mb-3">
                                    <Camera className="w-8 h-8 text-text-secondary" />
                                    <Upload className="w-8 h-8 text-text-secondary" />
                                </div>
                                <p className="text-sm font-medium text-secondary">Tap to take a photo or choose a file</p>
                                <p className="text-[10px] text-gray-400 mt-1">JPG, PNG or WEBP</p>
                            </div>
                        )}
                    </label>

                    {preview && !isProcessing && (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full mt-3 text-xs font-medium text-primary hover:underline cursor-pointer flex items-center justify-center gap-1.5"
                        >
                            <FileImage className="w-3.5 h-3.5" /> Choose a different image
                        </button>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={!compressedDataUrl || isProcessing || isUploading}
                        className="w-full mt-6 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                    >
                        {isUploading ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</>
                        ) : (
                            <><CheckCircle2 className="w-5 h-5" /> Confirm & Add to Cart</>
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}

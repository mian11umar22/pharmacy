"use client"

import { useState, useEffect } from 'react'
import { Loader2, Save, Image as ImageIcon, Layout, Type } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsAdminPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [activeTab, setActiveTab] = useState('content')

    // Content Settings State
    const [content, setContent] = useState({
        top_marquee: '',
        hero_title_main: '',
        hero_title_highlight: '',
        hero_subtitle: '',
    })

    // Ad Banner Settings State
    const [banner1, setBanner1] = useState({ image: '', link: '', active: false, discount: '' })
    const [banner2, setBanner2] = useState({ image: '', link: '', active: false, discount: '' })
    
    // Categories for dropdown
    const [categories, setCategories] = useState([])

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/admin/settings')
                const data = await res.json()
                if (data.settings) {
                    setContent({
                        top_marquee: data.settings.top_marquee || '',
                        hero_title_main: data.settings.hero_title_main || '',
                        hero_title_highlight: data.settings.hero_title_highlight || '',
                        hero_subtitle: data.settings.hero_subtitle || '',
                    })
                    if (data.settings.ad_banner_1) setBanner1({ discount: '', ...data.settings.ad_banner_1 })
                    if (data.settings.ad_banner_2) setBanner2({ discount: '', ...data.settings.ad_banner_2 })
                }
            } catch (error) {
                toast.error('Failed to load settings')
            }

            try {
                const catRes = await fetch('/api/categories')
                const catData = await catRes.json()
                if (catData.categories) {
                    setCategories(catData.categories)
                }
            } catch (error) {
                console.error('Failed to load categories', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchSettings()
    }, [])

    const handleImageUpload = async (e, setBannerFunction, currentBannerState) => {
        const file = e.target.files?.[0]
        if (!file) return

        const toastId = toast.loading('Processing image...')
        
        // Client-side image compression to prevent 500 API PayloadTooLarge Errors
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (event) => {
            const img = new Image()
            img.src = event.target.result
            img.onload = async () => {
                const canvas = document.createElement('canvas')
                const MAX_WIDTH = 1200
                const scaleSize = MAX_WIDTH / img.width
                canvas.width = MAX_WIDTH
                canvas.height = img.height * scaleSize
                
                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                
                const base64data = canvas.toDataURL('image/jpeg', 0.8) // 80% quality compression

                toast.loading('Uploading to server...', { id: toastId })
                try {
                    const res = await fetch('/api/upload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ image: base64data, folder: 'hope-pharmacy/banners' })
                    })
                    const data = await res.json()
                    if (data.success) {
                        setBannerFunction({ ...currentBannerState, image: data.url })
                        toast.success('Image uploaded successfully', { id: toastId })
                    } else {
                        toast.error(data.error || 'Upload failed', { id: toastId })
                    }
                } catch (error) {
                    toast.error('Something went wrong', { id: toastId })
                }
            }
        }
    }

    const handleSaveContent = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            // Save each content key
            for (const [key, value] of Object.entries(content)) {
                await fetch('/api/admin/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key, value })
                })
            }
            toast.success('Content settings saved!')
        } catch (error) {
            toast.error('Failed to save content')
        } finally {
            setIsSaving(false)
        }
    }

    const handleSaveBanners = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'ad_banner_1', value: banner1 })
            })
            await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'ad_banner_2', value: banner2 })
            })
            toast.success('Ad banners saved!')
        } catch (error) {
            toast.error('Failed to save banners')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl">
            <h1 className="text-2xl font-bold text-secondary mb-6">Marketing & CMS Settings</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-border">
                <button
                    onClick={() => setActiveTab('content')}
                    className={`pb-3 px-2 font-semibold transition-colors flex items-center gap-2 ${activeTab === 'content' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-secondary'}`}
                >
                    <Type className="w-4 h-4" /> Text Content
                </button>
                <button
                    onClick={() => setActiveTab('banners')}
                    className={`pb-3 px-2 font-semibold transition-colors flex items-center gap-2 ${activeTab === 'banners' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-secondary'}`}
                >
                    <ImageIcon className="w-4 h-4" /> Ad Banners
                </button>
            </div>

            {/* Content Tab */}
            {activeTab === 'content' && (
                <form onSubmit={handleSaveContent} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-border">
                    <div>
                        <label className="block text-sm font-bold text-secondary mb-2">Top Marquee Text (Running line)</label>
                        <input
                            type="text"
                            value={content.top_marquee}
                            onChange={(e) => setContent({ ...content, top_marquee: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="e.g. Free Delivery on orders above Rs. 2000!"
                        />
                        <p className="text-xs text-text-secondary mt-1">This text scrolls at the very top of the website.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-secondary mb-2">Landing Page Main Heading</label>
                        <input
                            type="text"
                            value={content.hero_title_main}
                            onChange={(e) => setContent({ ...content, hero_title_main: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="e.g. Trusted Medicines"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-secondary mb-2">Highlighted Text (Green color text)</label>
                        <input
                            type="text"
                            value={content.hero_title_highlight}
                            onChange={(e) => setContent({ ...content, hero_title_highlight: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="e.g. Delivered to You"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-secondary mb-2">Landing Page Hero Subtitle</label>
                        <textarea
                            value={content.hero_subtitle}
                            onChange={(e) => setContent({ ...content, hero_subtitle: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none h-20"
                            placeholder="e.g. Order genuine medicines, vitamins..."
                        />
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" disabled={isSaving} className="btn-primary py-2 px-6 rounded-lg flex items-center gap-2">
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Content
                        </button>
                    </div>
                </form>
            )}

            {/* Banners Tab */}
            {activeTab === 'banners' && (
                <form onSubmit={handleSaveBanners} className="space-y-8">
                    {/* Banner 1 */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
                        <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
                            <h2 className="text-lg font-bold text-secondary flex items-center gap-2">
                                <Layout className="w-5 h-5 text-primary" /> Slot 1: Hero Right Banner
                            </h2>
                            <label className="flex items-center cursor-pointer gap-2">
                                <span className="text-sm font-bold text-secondary">Active:</span>
                                <input 
                                    type="checkbox" 
                                    checked={banner1.active}
                                    onChange={(e) => setBanner1({ ...banner1, active: e.target.checked })}
                                    className="w-5 h-5 accent-primary cursor-pointer"
                                />
                            </label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-secondary mb-2">Upload Banner Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, setBanner1, banner1)}
                                    className="w-full px-4 py-2 rounded-lg border border-border outline-none mb-1 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                />
                                <p className="text-xs text-text-secondary mb-4">Recommended size: 1200x300 (Desktop), 800x600 (Mobile)</p>
                                <label className="block text-sm font-bold text-secondary mb-2 mt-4">Where should this Banner take the user?</label>
                                <select
                                    value={banner1.link}
                                    onChange={(e) => setBanner1({ ...banner1, link: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none bg-white cursor-pointer"
                                >
                                    <option value="">No Link (Just show image)</option>
                                    <option value="/products">All Products</option>
                                    {categories.map(c => (
                                        <option key={c._id} value={`/products?category=${c.slug}`}>Category: {c.name}</option>
                                    ))}
                                </select>

                                <label className="block text-sm font-bold text-secondary mb-2 mt-4">Category Sale Discount % (Optional)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="99"
                                    value={banner1.discount}
                                    onChange={(e) => setBanner1({ ...banner1, discount: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="e.g. 20"
                                />
                                <p className="text-xs text-text-secondary mt-1">If set, ALL products in the linked Category will get this dynamic % discount.</p>
                            </div>
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-4 bg-gray-50 min-h-[150px]">
                                {banner1.image ? (
                                    <img src={banner1.image} alt="Preview" className="max-h-32 object-contain rounded-lg shadow-sm" />
                                ) : (
                                    <span className="text-sm text-text-secondary">Image Preview</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Banner 2 */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
                        <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
                            <h2 className="text-lg font-bold text-secondary flex items-center gap-2">
                                <Layout className="w-5 h-5 text-primary" /> Slot 2: Offers of the Day (Middle)
                            </h2>
                            <label className="flex items-center cursor-pointer gap-2">
                                <span className="text-sm font-bold text-secondary">Active:</span>
                                <input 
                                    type="checkbox" 
                                    checked={banner2.active}
                                    onChange={(e) => setBanner2({ ...banner2, active: e.target.checked })}
                                    className="w-5 h-5 accent-primary cursor-pointer"
                                />
                            </label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-secondary mb-2">Upload Banner Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, setBanner2, banner2)}
                                    className="w-full px-4 py-2 rounded-lg border border-border outline-none mb-1 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                />
                                <p className="text-xs text-text-secondary mb-4">Recommended size: 1200x300 (Desktop), 800x600 (Mobile)</p>
                                <label className="block text-sm font-bold text-secondary mb-2 mt-4">Where should this Banner take the user?</label>
                                <select
                                    value={banner2.link}
                                    onChange={(e) => setBanner2({ ...banner2, link: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none bg-white cursor-pointer"
                                >
                                    <option value="">No Link (Just show image)</option>
                                    <option value="/products">All Products</option>
                                    {categories.map(c => (
                                        <option key={c._id} value={`/products?category=${c.slug}`}>Category: {c.name}</option>
                                    ))}
                                </select>

                                <label className="block text-sm font-bold text-secondary mb-2 mt-4">Category Sale Discount % (Optional)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="99"
                                    value={banner2.discount}
                                    onChange={(e) => setBanner2({ ...banner2, discount: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="e.g. 15"
                                />
                                <p className="text-xs text-text-secondary mt-1">If set, ALL products in the linked Category will get this dynamic % discount.</p>
                            </div>
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-4 bg-gray-50 min-h-[150px]">
                                {banner2.image ? (
                                    <img src={banner2.image} alt="Preview" className="max-h-32 object-contain rounded-lg shadow-sm" />
                                ) : (
                                    <span className="text-sm text-text-secondary">Image Preview</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" disabled={isSaving} className="btn-primary py-2 px-6 rounded-lg flex items-center gap-2">
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Banners
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}

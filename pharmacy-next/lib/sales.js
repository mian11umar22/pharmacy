import Setting from '@/models/Setting'

// Applies dynamic banner discounts to products on the fly
export async function applyDynamicSales(products) {
    if (!products || products.length === 0) return products

    try {
        const settings = await Setting.find({ key: { $in: ['ad_banner_1', 'ad_banner_2'] } })
        
        let saleDiscounts = {} // { categorySlug: maxDiscountPercentage }
        
        settings.forEach(s => {
            const banner = s.value
            // Only apply if banner is active, has discount, and is linked to a category
            if (banner?.active && banner.discount > 0 && banner.link?.includes('?category=')) {
                const catSlug = banner.link.split('?category=')[1].split('&')[0] // extract pure slug
                if (catSlug) {
                    const discountNum = parseInt(banner.discount)
                    if (!isNaN(discountNum) && discountNum > 0) {
                        saleDiscounts[catSlug] = Math.max(saleDiscounts[catSlug] || 0, discountNum)
                    }
                }
            }
        })

        if (Object.keys(saleDiscounts).length === 0) return products

        const isArray = Array.isArray(products)
        const productsList = isArray ? products : [products]

        const updatedList = productsList.map(p => {
            const catSlug = p.category?.slug
            if (catSlug && saleDiscounts[catSlug]) {
                const dynamicDiscount = saleDiscounts[catSlug]
                const pObj = p.toObject ? p.toObject() : { ...p }
                
                // Compare with product's intrinsic discount. Apply whichever is better.
                const currentDiscount = pObj.discount || 0
                
                if (dynamicDiscount > currentDiscount) {
                    pObj.originalPrice = pObj.originalPrice || pObj.price
                    // Recalculate new sale price
                    pObj.price = Math.round(pObj.originalPrice * (1 - dynamicDiscount / 100))
                    pObj.discount = dynamicDiscount
                }
                return pObj
            }
            return p
        })

        return isArray ? updatedList : updatedList[0]

    } catch (error) {
        console.error("Failed to apply dynamic sales:", error)
        return products // Fallback to original
    }
}

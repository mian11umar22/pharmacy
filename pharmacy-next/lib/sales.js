import Setting from '@/models/Setting'

// Applies dynamic banner discounts to products on the fly
export async function applyDynamicSales(products) {
    if (!products || products.length === 0) return products

    try {
        const settings = await Setting.find({ key: { $in: ['ad_banner_1', 'ad_banner_2'] } })
        
        let saleDiscounts = {} // { categorySlug: maxDiscountPercentage }
        
        settings.forEach(s => {
            const banner = s.value
            if (banner?.active && banner.discount > 0) {
                const discountNum = parseInt(banner.discount)
                if (isNaN(discountNum) || discountNum <= 0) return

                if (banner.link?.includes('?category=')) {
                    // Category-specific sale
                    const catSlug = banner.link.split('?category=')[1].split('&')[0]
                    if (catSlug) {
                        saleDiscounts[catSlug] = Math.max(saleDiscounts[catSlug] || 0, discountNum)
                    }
                } else if (banner.link === '/products') {
                    // Global sale (All Products)
                    saleDiscounts['ALL'] = Math.max(saleDiscounts['ALL'] || 0, discountNum)
                }
            }
        })

        if (Object.keys(saleDiscounts).length === 0) return products

        const isArray = Array.isArray(products)
        const productsList = isArray ? products : [products]

        const updatedList = productsList.map(p => {
            const catSlug = p.category?.slug
            
            // Get the best applicable discount (either category specific or ALL)
            const catDiscount = (catSlug && saleDiscounts[catSlug]) ? saleDiscounts[catSlug] : 0
            const globalDiscount = saleDiscounts['ALL'] || 0
            const dynamicDiscount = Math.max(catDiscount, globalDiscount)

            if (dynamicDiscount > 0) {
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

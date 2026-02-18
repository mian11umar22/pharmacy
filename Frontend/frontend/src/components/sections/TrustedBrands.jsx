
const brands = [
    "Pfizer", "GSK", "Abbott", "Getz Pharma", "Novartis", "Sanofi", "Searle", "Bayer"
]

const TrustedBrands = () => {
    return (
        <section className="py-10 bg-gray-50 border-t border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm font-semibold text-text-secondary uppercase tracking-wider mb-8">
                    Trusted by Top Brands
                </p>

                {/* Simple Grid for Brands (Clean & Professional) */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {brands.map((brand, index) => (
                        <div key={index} className="flex justify-center group cursor-default">
                            {/* Using Text as Logo for now to avoid broken images, styled to look like logos */}
                            <span className="text-xl md:text-2xl font-bold font-sans text-gray-400 group-hover:text-primary transition-colors">
                                {brand}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TrustedBrands

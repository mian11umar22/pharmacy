import Image from 'next/image'

const brands = [
    { id: 1, name: 'GSK', logo: 'https://placehold.co/120x60?text=GSK' },
    { id: 2, name: 'Pfizer', logo: 'https://placehold.co/120x60?text=Pfizer' },
    { id: 3, name: 'Abbott', logo: 'https://placehold.co/120x60?text=Abbott' },
    { id: 4, name: 'Bayer', logo: 'https://placehold.co/120x60?text=Bayer' },
    { id: 5, name: 'Sanofi', logo: 'https://placehold.co/120x60?text=Sanofi' },
    { id: 6, name: 'Novartis', logo: 'https://placehold.co/120x60?text=Novartis' },
]

const TrustedBrands = () => {
    return (
        <section className="py-12 bg-white border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-sm font-semibold text-text-secondary uppercase tracking-widest mb-8">
                    Trusted by Leading Pharmaceutical Brands
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {brands.map((brand) => (
                        <div key={brand.id} className="relative h-8 md:h-12 w-24 md:w-32">
                            <Image
                                src={brand.logo}
                                alt={brand.name}
                                fill
                                className="object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TrustedBrands

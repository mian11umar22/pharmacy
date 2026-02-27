import Link from 'next/link'
import { CATEGORIES_DATA } from '@/lib/categories-data'

const Categories = () => {
    // Show only featured categories on homepage
    const featured = CATEGORIES_DATA.filter(c => c.isFeatured)

    return (
        <section className="py-12 md:py-20 bg-background/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center md:items-end md:flex-row justify-between mb-8 md:mb-12 gap-4 text-center md:text-left">
                    <div className="animate-fade-up">
                        <h2 className="text-2xl md:text-4xl font-black text-secondary mb-2 tracking-tight">Popular <span className="text-primary">Categories</span></h2>
                        <p className="text-sm md:text-base text-text-secondary font-medium">Top quality products from trusted healthcare brands</p>
                    </div>
                    <Link href="/categories" className="text-primary font-bold hover:underline mb-1 text-sm md:text-base">
                        View All Categories →
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
                    {featured.map((cat, index) => (
                        <Link
                            key={cat.id}
                            href={`/categories`}
                            className="group relative flex flex-col items-center p-4 md:p-8 rounded-2xl md:rounded-[32px] bg-white border border-border/50 hover:border-primary/40 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 overflow-hidden"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* First letter circle */}
                            <div className={`relative z-10 w-12 h-12 md:w-20 md:h-20 rounded-full ${cat.bgColor} flex items-center justify-center mb-3 md:mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                <span className={`text-xl md:text-3xl font-black ${cat.letterColor}`}>
                                    {cat.name.charAt(0)}
                                </span>
                            </div>
                            <h3 className="relative z-10 font-bold text-secondary text-center tracking-tight text-sm md:text-lg group-hover:text-primary transition-colors">
                                {cat.name}
                            </h3>

                            {/* Decorative dot */}
                            <div className="absolute top-2 right-2 md:top-4 md:right-4 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-border group-hover:bg-primary transition-colors"></div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Categories

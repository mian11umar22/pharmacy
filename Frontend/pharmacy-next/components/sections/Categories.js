import Link from 'next/link'

const categories = [
    { id: 1, name: 'Medicine', icon: '💊', color: 'from-blue-500/20 to-blue-600/5', text: 'text-blue-700' },
    { id: 2, name: 'Personal Care', icon: '🧴', color: 'from-pink-500/20 to-pink-600/5', text: 'text-pink-700' },
    { id: 3, name: 'Baby Care', icon: '👶', color: 'from-sky-500/20 to-sky-600/5', text: 'text-sky-700' },
    { id: 4, name: 'Nutrition', icon: '🍏', color: 'from-green-500/20 to-green-600/5', text: 'text-green-700' },
    { id: 5, name: 'Healthcare', icon: '🩺', color: 'from-emerald-500/20 to-emerald-600/5', text: 'text-emerald-700' },
    { id: 6, name: 'Wellness', icon: '🧘', color: 'from-purple-500/20 to-purple-600/5', text: 'text-purple-700' },
]

const Categories = () => {
    return (
        <section className="py-12 md:py-20 bg-background/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center md:items-end md:flex-row justify-between mb-8 md:mb-12 gap-4 text-center md:text-left">
                    <div className="animate-fade-up">
                        <h2 className="text-2xl md:text-4xl font-black text-secondary mb-2 tracking-tight">Shop by <span className="text-primary">Category</span></h2>
                        <p className="text-sm md:text-base text-text-secondary font-medium">Top quality products from trusted healthcare brands</p>
                    </div>
                    <Link href="/products" className="text-primary font-bold hover:underline mb-1 text-sm md:text-base">
                        View All Categories →
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
                    {categories.map((cat, index) => (
                        <Link
                            key={cat.id}
                            href={`/products?category=${cat.name.toLowerCase()}`}
                            className="group relative flex flex-col items-center p-4 md:p-8 rounded-2xl md:rounded-[32px] bg-white border border-border/50 hover:border-primary/40 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 overflow-hidden"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Gradient Background on Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                            <div className="relative z-10 w-12 h-12 md:w-20 md:h-20 rounded-full bg-background flex items-center justify-center text-2xl md:text-4xl mb-3 md:mb-6 shadow-inner group-hover:bg-white transition-colors duration-500 group-hover:scale-110">
                                {cat.icon}
                            </div>
                            <h3 className={`relative z-10 font-bold ${cat.text} text-center tracking-tight text-sm md:text-lg`}>
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

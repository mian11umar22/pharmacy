import { Link } from 'react-router-dom'

const categories = [
    { id: 1, name: 'Pain Relief', icon: '💊', color: 'bg-red-100 text-red-600', hue: 'red' },
    { id: 2, name: 'Vitamins', icon: '🧴', color: 'bg-orange-100 text-orange-600', hue: 'orange' },
    { id: 3, name: 'Skin Care', icon: '✨', color: 'bg-pink-100 text-pink-600', hue: 'pink' },
    { id: 4, name: 'Baby Care', icon: '👶', color: 'bg-blue-100 text-blue-600', hue: 'blue' },
    { id: 5, name: 'Diabetes', icon: '🩸', color: 'bg-green-100 text-green-600', hue: 'green' },
    { id: 6, name: 'First Aid', icon: '🩹', color: 'bg-yellow-100 text-yellow-600', hue: 'yellow' },
]

const Categories = () => {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 animate-fade-up">
                    <h2 className="text-3xl font-bold text-secondary mb-3">Shop by Category</h2>
                    <p className="text-text-secondary">Find exactly what you need for your health</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {categories.map((cat, index) => (
                        <Link
                            key={cat.id}
                            to={`/products?category=${cat.name.toLowerCase()}`}
                            className="group flex flex-col items-center p-6 rounded-2xl bg-background border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-hover hover:-translate-y-2"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className={`w-16 h-16 rounded-full ${cat.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                {cat.icon}
                            </div>
                            <h3 className="font-semibold text-secondary group-hover:text-primary transition-colors text-center">
                                {cat.name}
                            </h3>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Categories

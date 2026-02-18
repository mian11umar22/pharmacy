import Hero from '../components/sections/Hero'
import Categories from '../components/sections/Categories'
import FeaturedProducts from '../components/sections/FeaturedProducts'
import TrustedBrands from '../components/sections/TrustedBrands'


const Home = () => {
    return (
        <div className="animate-fade-in">
            <Hero />
            <Categories />
            <FeaturedProducts />


            {/* Promo Banner */}

        </div>
    )
}

export default Home

import Hero from '@/components/sections/Hero'
import Categories from '@/components/sections/Categories'
import FeaturedProducts from '@/components/sections/FeaturedProducts'
import PrescriptionBanner from '@/components/sections/PrescriptionBanner'

export default function Home() {
  return (
    <div className="animate-fade-in">
      <Hero />
      <Categories />
      <FeaturedProducts />
      <PrescriptionBanner />
    </div>
  )
}

import Hero from '@/components/sections/Hero'
import Categories from '@/components/sections/Categories'
import FeaturedProducts from '@/components/sections/FeaturedProducts'
import PrescriptionBanner from '@/components/sections/PrescriptionBanner'
import AdBanner from '@/components/sections/AdBanner'

export default function Home() {
  return (
    <div className="animate-fade-in">
      <Hero />
      <AdBanner slot="ad_banner_1" />
      <Categories />
      <AdBanner slot="ad_banner_2" />
      <FeaturedProducts />
      <PrescriptionBanner />
    </div>
  )
}

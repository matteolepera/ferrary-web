import { FeaturedCarousel } from '@/components/home/FeaturedCarousel'
import { HomeHero } from '@/components/home/HomeHero'
import { HomeManifesto } from '@/components/home/HomeManifesto'

export function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeManifesto />
      <FeaturedCarousel />
    </>
  )
}

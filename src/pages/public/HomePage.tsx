import { FeaturedCarousel } from '@/components/home/FeaturedCarousel'
import { HomeHero } from '@/components/home/HomeHero'
import { HomeManifesto } from '@/components/home/HomeManifesto'
import { HomeFamilies } from '@/components/home/HomeFamilies'

export function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeManifesto />
      <FeaturedCarousel />
      <HomeFamilies />
    </>
  )
}

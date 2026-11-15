import { FeaturedPanels } from '@/components/home/FeaturedPanels'
import { HomeHero } from '@/components/home/HomeHero'
import { HomeManifesto } from '@/components/home/HomeManifesto'
import { HomeFamilies } from '@/components/home/HomeFamilies'
import { HomeInvite } from '@/components/home/HomeInvite'

export function HomePage() {
  return (
    <>
      <HomeHero />
      <FeaturedPanels />
      <HomeManifesto />
      <HomeFamilies />
      <HomeInvite />
    </>
  )
}

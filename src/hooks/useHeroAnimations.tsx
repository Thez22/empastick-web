import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useHeroAnimations() {
  const heroRef = useRef<HTMLDivElement>(null)
  const hasReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (hasReducedMotion || !heroRef.current) return

    const heroContent = heroRef.current.querySelector('.hero-content')
    const heroGallery = heroRef.current.querySelector('.hero-gallery')
    const galleryImgs = heroRef.current.querySelectorAll('.hero-gallery-img')

    if (heroContent) {
      gsap.set(heroContent, { opacity: 0, y: 24 })
      gsap.to(heroContent, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        delay: 0.15,
      })
    }

    if (heroGallery && galleryImgs.length) {
      gsap.set(heroGallery, { opacity: 0, y: 30 })
      gsap.to(heroGallery, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        delay: 0.25,
      })
      galleryImgs.forEach((img, i) => {
        gsap.set(img, { opacity: 0, y: 20 })
        gsap.to(img, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.35 + i * 0.06,
          ease: 'power2.out',
        })
      })
    }

    // Parallax léger sur la galerie hero au scroll
    if (heroGallery) {
      gsap.to(heroGallery, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      })
    }
  }, [hasReducedMotion])

  return heroRef
}

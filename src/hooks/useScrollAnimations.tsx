import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollAnimations() {
  const location = useLocation()
  const hasReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (hasReducedMotion) return

    const duration = 0.7
    const ease = 'power2.out'
    const yOffset = 36

    // Révélation des sections split
    const splitSections = document.querySelectorAll('.split-section')
    splitSections.forEach((section) => {
      const img = section.querySelector('.split-image')
      const content = section.querySelector('.split-content')
      if (img || content) {
        gsap.set([img, content].filter(Boolean), { opacity: 0, y: yOffset })
        gsap.to([img, content].filter(Boolean), {
          opacity: 1,
          y: 0,
          duration,
          ease,
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        })
      }
    })

    // Parallax sur les images split
    document.querySelectorAll('.split-section .split-image').forEach((img) => {
      gsap.to(img, {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.split-section'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    })

    // Bloc orange
    const orangeBlock = document.querySelector('.orange-block')
    if (orangeBlock) {
      const orangeParts = orangeBlock.querySelectorAll('.split-content, .split-image')
      gsap.set(orangeParts, { opacity: 0, y: yOffset })
      gsap.to(orangeParts, {
        opacity: 1,
        y: 0,
        duration,
        ease,
        stagger: 0.1,
        scrollTrigger: {
          trigger: orangeBlock,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })
    }

    // Product hero
    const productHero = document.querySelector('.product-hero')
    if (productHero) {
      const productGallery = productHero.querySelector('.product-gallery')
      const productInfo = productHero.querySelector('.product-info')
      if (productGallery) {
        gsap.set(productGallery, { opacity: 0, x: -24 })
        gsap.to(productGallery, {
          opacity: 1,
          x: 0,
          duration: 0.85,
          ease,
          scrollTrigger: {
            trigger: productHero,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        })
      }
      if (productInfo) {
        gsap.set(productInfo, { opacity: 0, x: 24 })
        gsap.to(productInfo, {
          opacity: 1,
          x: 0,
          duration: 0.85,
          ease,
          scrollTrigger: {
            trigger: productHero,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        })
      }
    }

    // Feature rows
    document.querySelectorAll('.feature-row').forEach((row) => {
      const info = row.querySelector('.feature-text')
      const pic = row.querySelector('.feature-image')
      if (info || pic) {
        gsap.set([info, pic].filter(Boolean), { opacity: 0, y: 20 })
        gsap.to([info, pic].filter(Boolean), {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease,
          stagger: 0.06,
          scrollTrigger: {
            trigger: row,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        })
      }
    })

    // Footer
    const footer = document.querySelector('footer')
    if (footer) {
      gsap.set(footer, { opacity: 0 })
      gsap.to(footer, {
        opacity: 1,
        duration: 0.6,
        scrollTrigger: {
          trigger: footer,
          start: 'top 95%',
          toggleActions: 'play none none none',
        },
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [location.pathname, hasReducedMotion])
}

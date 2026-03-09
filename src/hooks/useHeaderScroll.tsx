import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useHeaderScroll() {
  useEffect(() => {
    const header = document.querySelector('header')
    if (!header) return

    ScrollTrigger.create({
      trigger: document.documentElement,
      start: '20 0',
      end: 'max',
      onEnter: () => header.classList.add('header-scrolled'),
      onLeaveBack: () => header.classList.remove('header-scrolled'),
    })

    if (window.scrollY > 20) header.classList.add('header-scrolled')

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === document.documentElement) trigger.kill()
      })
    }
  }, [])
}

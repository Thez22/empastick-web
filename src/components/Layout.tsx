import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { CookieBanner } from './CookieBanner'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Empastick – Bâton de marche connecté',
  '/produit': 'Produit – Empastick',
  '/a-propos': 'À propos – Empastick',
  '/panier': 'Panier – Empastick',
  '/commande/confirmation': 'Confirmation de commande – Empastick',
  '/profil': 'Mon compte – Empastick',
  '/mentions-legales': 'Mentions légales – Empastick',
  '/politique': 'Politique de confidentialité – Empastick',
  '/404': 'Page introuvable – Empastick',
}

export function Layout() {
  const { pathname } = useLocation()
  useEffect(() => {
    document.title = PAGE_TITLES[pathname] ?? 'Empastick'
  }, [pathname])

  useEffect(() => {
    if (pathname === '/produit') {
      document.body.classList.add('page-produit')
      return () => document.body.classList.remove('page-produit')
    }
  }, [pathname])

  return (
    <div className={`min-h-screen flex flex-col ${pathname === '/produit' ? 'bg-transparent' : ''}`}>
      <Header />
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  )
}

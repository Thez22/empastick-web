import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useHeaderScroll } from '../hooks/useHeaderScroll'

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/produit', label: 'Produit' },
  { to: '/a-propos', label: 'À propos' },
]

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
      <path fill="currentColor" d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.45A1.99 1.99 0 0 0 10 19h10v-2h-9.42a.25.25 0 0 1-.23-.37L11.1 15h5.45a2 2 0 0 0 1.79-1.11l3.58-6.49A1 1 0 0 0 21 6H7z" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
      <path fill="currentColor" d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5z" />
    </svg>
  )
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  useHeaderScroll()

  return (
    <header className="sticky top-0 z-[100] bg-white border-b border-border-soft transition-shadow duration-250">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        <NavLink to="/" className="flex items-center">
          <img src="/images/empastick.png" alt="Empastick" className="h-9 w-auto max-w-[140px]" />
        </NavLink>

        <button
          type="button"
          className="md:hidden flex flex-col justify-around w-7 h-6 bg-transparent border-0 cursor-pointer"
          aria-label="Menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span className={`block h-0.5 bg-[#1a1d21] rounded ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 bg-[#1a1d21] rounded ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 bg-[#1a1d21] rounded ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'font-semibold text-[#EB5E4E]' : 'text-[#1a1d21]')}>
              {label}
            </NavLink>
          ))}
          <NavLink to="/panier" className="text-[#1a1d21] p-1" title="Panier"><CartIcon /></NavLink>
          <NavLink to="/profil" className="text-[#1a1d21] p-1" title="Mon compte"><UserIcon /></NavLink>
        </nav>
      </div>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[999] md:hidden" onClick={() => setMobileOpen(false)} />
          <nav className="fixed top-0 right-0 w-[85%] max-w-[320px] h-full bg-white shadow-xl z-[1000] pt-16 pb-6 overflow-y-auto md:hidden">
            <ul className="list-none m-0 p-0">
              {navLinks.map(({ to, label }) => (
                <li key={to} className="border-b border-border-soft">
                  <NavLink to={to} className={({ isActive }) => `flex items-center gap-3 px-6 py-4 font-medium ${isActive ? 'text-[#EB5E4E] font-semibold' : ''}`} onClick={() => setMobileOpen(false)}>{label}</NavLink>
                </li>
              ))}
              <li className="border-b border-border-soft">
                <NavLink to="/panier" className="flex items-center gap-3 px-6 py-4" onClick={() => setMobileOpen(false)}><CartIcon /> Panier</NavLink>
              </li>
              <li className="border-b border-border-soft">
                <NavLink to="/profil" className="flex items-center gap-3 px-6 py-4" onClick={() => setMobileOpen(false)}><UserIcon /> Mon compte</NavLink>
              </li>
            </ul>
          </nav>
        </>
      )}
    </header>
  )
}

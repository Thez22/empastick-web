import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-border-soft bg-white py-6 px-4 sm:px-10 text-sm text-text-muted">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 md:text-left text-center">
        <div className="flex justify-center md:justify-start">
          <img src="/images/empastick.png" alt="Empastick" className="h-7 w-auto max-w-[110px]" />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-medium text-[#1a1d21]">empastick</span>
          <Link to="/mentions-legales" className="hover:text-cta">Mentions légales</Link>
          <Link to="/politique" className="hover:text-cta">Politique de confidentialité</Link>
        </div>
        <div className="leading-relaxed md:text-right">
          téléphone : +33 (0)0 00 00 00 00<br />
          email : contact@empastick.fr<br />
          adresse : 750xx – super adresse, 00000 ville<br />
          Tous droits réservés © empastick
        </div>
      </div>
    </footer>
  )
}

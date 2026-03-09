import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-border-soft bg-white py-8 px-4 sm:px-10 text-sm text-text-muted">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 md:text-left text-center">
        <div className="flex flex-col items-center md:items-start gap-3">
          <Link to="/">
            <img src="/images/empastick.png" alt="Empastick" className="h-7 w-auto max-w-[110px]" />
          </Link>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[#1a1d21]">
            <Link to="/" className="hover:text-cta">Accueil</Link>
            <Link to="/produit" className="hover:text-cta">Produit</Link>
            <Link to="/a-propos" className="hover:text-cta">À propos</Link>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-medium text-[#1a1d21]">Informations</span>
          <Link to="/mentions-legales" className="hover:text-cta">Mentions légales</Link>
          <Link to="/politique" className="hover:text-cta">Politique de confidentialité</Link>
        </div>
        <div className="leading-relaxed md:text-right">
          Téléphone : +33 (0)0 00 00 00 00<br />
          Email : <a href="mailto:contact@empastick.fr" className="hover:text-cta">contact@empastick.fr</a><br />
          Adresse : 70 Av. Roger Devoucoux, 83000 Toulon<br />
          <span className="block mt-2">Tous droits réservés © Empastick</span>
        </div>
      </div>
    </footer>
  )
}

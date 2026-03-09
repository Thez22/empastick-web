import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-[600px] mx-auto flex flex-col md:flex-row items-center gap-8 py-16">
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-4xl font-bold text-[#1a1d21] mb-2">Oups !</h1>
        <p className="text-text-muted mb-4">La page que vous cherchez semble introuvable.</p>
        <p className="text-sm text-text-muted mb-6">Code d&apos;erreur : 404</p>
        <p className="text-sm text-[#1a1d21] mb-2">Voici quelques liens utiles à la place :</p>
        <nav className="flex flex-wrap gap-4">
          <Link to="/" className="text-cta font-medium hover:underline">Page d&apos;accueil</Link>
          <Link to="/produit" className="text-cta font-medium hover:underline">Acheter</Link>
          <Link to="/a-propos" className="text-cta font-medium hover:underline">À propos</Link>
        </nav>
      </div>
      <div className="flex-1">
        <img src="/images/hsb.png" alt="" className="w-full max-w-xs mx-auto" />
      </div>
    </div>
  )
}

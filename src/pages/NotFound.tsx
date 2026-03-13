import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-[600px] mx-auto flex flex-col items-center gap-8 py-16">
      <Link to="/" className="mb-4">
        <img src="/favicon.jpg" alt="Empastick" className="h-10 w-auto object-contain" />
      </Link>
      <div className="flex flex-col md:flex-row items-center gap-8 w-full">
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-4xl font-bold text-[#1a1d21] mb-2">Oups !</h1>
        <p className="text-text-muted mb-4">La page que vous cherchez semble introuvable.</p>
        <p className="text-sm text-text-muted mb-6">Code d&apos;erreur : 404</p>
        <p className="text-sm text-[#1a1d21] mb-2">Voici quelques liens utiles :</p>
        <nav className="flex flex-wrap gap-3">
          <Link to="/" className="bg-cta hover:bg-cta-hover text-white font-medium px-4 py-2 rounded-lg">Accueil</Link>
          <Link to="/produit" className="text-cta font-medium hover:underline">Produit</Link>
          <Link to="/panier" className="text-cta font-medium hover:underline">Panier</Link>
          <Link to="/a-propos" className="text-cta font-medium hover:underline">À propos</Link>
          <Link to="/connexion" className="text-cta font-medium hover:underline">Connexion</Link>
        </nav>
      </div>
      <div className="flex-1">
        <img src="/images/hsb.png" alt="" className="w-full max-w-xs mx-auto" />
      </div>
      </div>
    </div>
  )
}

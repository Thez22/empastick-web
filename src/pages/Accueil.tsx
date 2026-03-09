import { Link } from 'react-router-dom'
import { useHeroAnimations } from '../hooks/useHeroAnimations'
import { useScrollAnimations } from '../hooks/useScrollAnimations'

export default function Accueil() {
  const heroRef = useHeroAnimations()
  useScrollAnimations()

  return (
    <>
      <section ref={heroRef} className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <p className="hero-label">L&apos;assistance à la marche, repensée</p>
            <h1 className="hero-title">Empastick</h1>
            <p className="hero-subtitle">La solution qui optimise la marche et la sécurise grâce à notre technologie d&apos;assistance.</p>
            <Link to="/produit" className="btn-cta btn-cta-hero">Découvrir le produit</Link>
          </div>
          <div className="hero-gallery">
            <img src="/images/main/v1.png" className="hero-gallery-img" alt="" />
            <img src="/images/main/v2.png" className="hero-gallery-img" alt="" />
            <img src="/images/main/v3.png" className="hero-gallery-img" alt="" />
            <img src="/images/main/v4.png" className="hero-gallery-img" alt="" />
          </div>
        </div>
      </section>

      <section className="split-section">
        <img src="/images/main/d1.png" className="split-image" alt="" />
        <div className="split-content">
          <h2>Vous l&apos;adorez déjà.</h2>
          <h1>Une technologie pensée pour l&apos;autonomie et le confort quotidien.</h1>
        </div>
      </section>

      <section className="orange-block">
        <div className="split-content">
          <h2 className="orange-block-title">Dirigez vous vers la facilité.</h2>
        </div>
        <img src="/images/main/d2.png" className="split-image" alt="" />
        <div className="split-content">
          <h1>Le design ergonomique rencontre l&apos;innovation pour une expérience de marche sans précédent.</h1>
        </div>
      </section>
    </>
  )
}

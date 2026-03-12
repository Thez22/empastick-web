import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { addToCart } from '../lib/cart'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useScrollAnimations } from '../hooks/useScrollAnimations'

const VARIANTS: Record<string, { name: string; main: string; top: string; bottom: string }> = {
  olive: { name: 'Olive', main: '/images/Adobe Express - file (2).png', top: '/images/olive/katman_1.png', bottom: '/images/olive/man.png' },
  gold: { name: 'Lavande', main: '/images/Adobe Express - file (1).png', top: '/images/lavande/violet.png', bottom: '/images/lavande/photoshopempastick.png' },
  neutral: { name: 'Flamme', main: '/images/Adobe Express - file.png', top: '/images/rouge/baton.png', bottom: '/images/rouge/womenbancrouge.png' },
}

const BASE_PRICE = 140
const MONTHLY = 9.99

function buy(userId: string | null, color: string, plan: string, refresh: () => Promise<void>) {
  const variant = VARIANTS[color]
  const name = `Empastick ${variant?.name ?? color}`
  addToCart(userId, {
    name,
    color,
    plan,
    basePrice: BASE_PRICE,
    monthlyPrice: plan === 'avec' ? MONTHLY : 0,
  }).then(refresh)
}

export default function Produit() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { refresh } = useCart()
  const [color, setColor] = useState<'olive' | 'gold' | 'neutral'>('olive')
  const [plan, setPlan] = useState<'sans' | 'avec'>('sans')
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)
  const v = VARIANTS[color]
  const imgMainRef = useRef<HTMLImageElement>(null)
  const imgTopRef = useRef<HTMLImageElement>(null)
  const imgBottomRef = useRef<HTMLImageElement>(null)
  useScrollAnimations()

  const carouselSlides = v ? [v.main, v.top, v.bottom] : []
  useEffect(() => setCarouselIndex(0), [color])

  useEffect(() => {
    const applyAnimation = (img: HTMLImageElement | null) => {
      if (!img) return
      img.style.opacity = '0'
      setTimeout(() => {
        img.style.transition = 'opacity 0.3s ease'
        img.style.opacity = '1'
      }, 10)
    }
    applyAnimation(imgMainRef.current)
    applyAnimation(imgTopRef.current)
    applyAnimation(imgBottomRef.current)
  }, [color])

  const handleColorChange = (newColor: 'olive' | 'gold' | 'neutral') => {
    setColor(newColor)
  }

  const handleBuy = () => {
    if (!user) {
      navigate('/connexion', { state: { requireAuth: true, returnTo: '/produit' } })
      return
    }
    buy(user.uid, color, plan, refresh)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 4000)
  }

  return (
    <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6">
      <section className="product-hero grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 py-6 md:py-8 items-start">
        {/* Sur mobile : infos (titre, prix, CTA) en premier */}
        <div className="product-info order-1 md:order-2 pt-0 md:pt-0">
          <p className="text-text-muted text-xs sm:text-sm mb-1">Bâton de marche connecté</p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#1a1d21] mb-2">Empastick <span style={{ color: color === 'olive' ? '#6b7c3d' : color === 'gold' ? '#9b8aa5' : '#EB5E4E' }}>{v?.name}</span></h1>
          <p className="text-xl sm:text-2xl font-semibold text-[#1a1d21] mb-4">140 €</p>
          <p className="text-[#1a1d21] text-sm sm:text-base mb-6">Avec Empastick, découvrez notre gamme de bâtons de marche connectés, la solution qui combine la marche et la sécurité grâce à notre technologie d&apos;assistance.</p>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <span className="text-sm text-text-muted">Coloris :</span>
            {(['olive', 'gold', 'neutral'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleColorChange(c)}
                className={`w-8 h-8 rounded-full border-2 ${c === 'olive' ? 'bg-[#6b7c3d]' : c === 'gold' ? 'bg-[#9b8aa5]' : 'bg-[#c45c4a]'} ${color === c ? 'border-cta ring-2 ring-cta/30' : 'border-gray-300'} transition-all`}
                title={VARIANTS[c].name}
                aria-label={VARIANTS[c].name}
              />
            ))}
            <span className="font-semibold ml-2" style={{ color: color === 'olive' ? '#6b7c3d' : color === 'gold' ? '#9b8aa5' : '#EB5E4E' }}>{v?.name}</span>
          </div>

          {!user && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              Pour acheter et pouvoir lier un abonnement à votre compte, <Link to="/connexion" state={{ requireAuth: true, returnTo: '/produit' }} className="font-medium underline">connectez-vous</Link> ou <Link to="/inscription" state={{ requireAuth: true, returnTo: '/produit' }} className="font-medium underline">créez un compte</Link>.
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <button
              type="button"
              onClick={() => setPlan('sans')}
              className={`text-left p-3 sm:p-4 rounded-xl border-2 ${plan === 'sans' ? 'border-cta bg-cta/5' : 'border-border-soft bg-white'}`}
            >
              <div className="font-medium text-[#1a1d21] text-sm sm:text-base">Sans abonnement</div>
              <div className="text-base sm:text-lg font-semibold text-cta">140 €</div>
              <ul className="text-xs sm:text-sm text-text-muted mt-1 sm:mt-2 space-y-0.5">
                <li>✔ Bâton</li>
                <li>✔ App</li>
                <li>✔ Alertes</li>
                <li>✔ Forum</li>
              </ul>
            </button>
            <button
              type="button"
              onClick={() => setPlan('avec')}
              className={`text-left p-3 sm:p-4 rounded-xl border-2 ${plan === 'avec' ? 'border-cta bg-cta/5' : 'border-border-soft bg-white'}`}
            >
              <div className="font-medium text-[#1a1d21] text-sm sm:text-base">Abonnement</div>
              <div className="text-base sm:text-lg font-semibold text-cta">140 € + 9,99 €/mois</div>
              <ul className="text-xs sm:text-sm text-text-muted mt-1 sm:mt-2 space-y-0.5">
                <li>✔ Bâton</li>
                <li>✔ App Empastick+</li>
                <li>✔ Alertes & suivi</li>
                <li>✔ Forum & événements</li>
              </ul>
            </button>
          </div>

          {addedToCart && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm flex items-center justify-between gap-2" role="status">
              <span>Ajouté au panier.</span>
              <Link to="/panier" className="font-medium underline">Voir le panier</Link>
            </div>
          )}
          <button type="button" onClick={handleBuy} className="w-full bg-cta hover:bg-cta-hover text-white font-medium py-3 rounded-lg transition-colors text-sm sm:text-base">Acheter</button>
        </div>

        {/* Galerie desktop (cachée sur mobile) */}
        <div className="product-gallery-wrapper order-2 md:order-1 hidden md:block">
          <div className="product-gallery">
            <figure className="product-gallery-main">
              <img ref={imgMainRef} src={v?.main} alt={`Empastick ${v?.name}`} />
            </figure>
            <figure className="product-gallery-top">
              <img ref={imgTopRef} src={v?.top} alt="" />
            </figure>
            <figure className="product-gallery-bottom">
              <img ref={imgBottomRef} src={v?.bottom} alt="" />
            </figure>
          </div>
        </div>

        {/* Carrousel mobile : une image + pastilles */}
        <div className="order-2 md:hidden product-carousel-mobile mt-4">
          <div className="rounded-2xl overflow-hidden bg-[#f2f1ef] flex items-center justify-center min-h-[280px] p-4">
            <img
              key={`${color}-${carouselIndex}`}
              src={carouselSlides[carouselIndex]}
              alt={`Vue ${carouselIndex + 1} - Empastick ${v?.name}`}
              className="max-h-[260px] w-auto object-contain"
            />
          </div>
          <div className="flex justify-center gap-2 mt-3">
            {carouselSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCarouselIndex(i)}
                aria-label={`Image ${i + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${i === carouselIndex ? 'bg-cta' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="py-6 sm:py-8 text-center px-2">
        <p className="text-xs sm:text-sm text-text-muted mb-2">Finition</p>
        <p className="text-[#1a1d21] font-medium mb-3 sm:mb-4 text-sm sm:text-base">Olive · Lavande · Flamme</p>
        <img src="/images/triple_baton.png" alt="Options de finitions" className="max-w-md mx-auto w-full px-2" />
      </div>

      {[
        { title: 'Bouton "SOS" intelligent', sub: 'Alerte immédiate en cas de besoin.', text: "En cas d'urgence, une simple pression sur le bouton SOS envoie immédiatement une notification aux proches. Si aucun retour n'est reçu dans la première minute, l'alerte est transmise aux services de secours.", img: '/images/triple_baton.png' },
        { title: 'Détection de chute du bâton', sub: 'Alerte automatique en cas de chute.', text: "Lorsque le bâton tombe, un signal sonore et une vibration se déclenchent. S'il n'est pas redressé en 1 minute, les proches reçoivent une alerte via l'application.", img: '/images/onde_baton.png' },
        { title: 'Compartiment intégré', sub: 'Rangement pratique.', text: "La partie supérieure du bâton comprend un compartiment discret pour ranger vos médicaments, clés ou autres petits objets indispensables.", img: '/images/triple_baton_profil.png' },
        { title: 'Localisation GPS en temps réel', sub: 'Suivi précis.', text: "Grâce au GPS intégré, les proches peuvent consulter la position de l'utilisateur via l'application.", img: '/images/tel.png' },
        { title: 'Station de recharge murale', sub: 'Recharge facile.', text: "Empastick se recharge facilement grâce à une station murale : il suffit de poser le bâton sur son support. La batterie reste ainsi toujours pleine.", img: '/images/baton_chargement.png' },
      ].map((f, i) => (
        <section key={i} className="feature-row grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 items-center py-6 sm:py-10">
          <div className={`feature-text order-2 md:order-none ${i % 2 === 1 ? 'md:order-2' : ''}`}>
            <h2 className="text-lg sm:text-xl font-semibold text-[#1a1d21]">{f.title}</h2>
            <h3 className="text-cta font-medium mb-1 sm:mb-2 text-sm sm:text-base">{f.sub}</h3>
            <p className="text-text-muted text-sm sm:text-base">{f.text}</p>
          </div>
          <img src={f.img} alt="" className={`feature-image rounded-lg w-full max-w-md mx-auto order-1 ${i % 2 === 1 ? 'md:order-1' : ''}`} />
        </section>
      ))}

      <div className="text-center py-8 sm:py-12 px-2">
        <button type="button" onClick={handleBuy} className="bg-cta hover:bg-cta-hover text-white font-medium px-6 sm:px-8 py-3 rounded-lg transition-colors text-sm sm:text-base">Acheter</button>
        <img src="/images/rond_triple_baton.png" alt="" className="mt-6 sm:mt-8 max-w-xs mx-auto w-full" />
      </div>

      <section className="py-8 sm:py-12 text-center px-2">
        <h2 className="text-xl sm:text-2xl font-semibold text-[#1a1d21] mb-3 sm:mb-4">Votre bâton, votre style</h2>
        <img src="/images/_x32_li.png" alt="Utilisatrices Empastick" className="max-w-lg mx-auto w-full" />
      </section>
    </div>
  )
}

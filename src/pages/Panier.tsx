import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { removeFromCart, updateQuantity, clearCart } from '../lib/cart'
import { sendOrderEmail } from '../lib/emailjs'
import { updateUserProfile } from '../lib/auth'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

function formatPrice(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)
}

export default function Panier() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, loading, refresh } = useCart()
  const [modalOpen, setModalOpen] = useState(false)
  const [paying, setPaying] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState<{ orderNumber: string; email: string; hasSubscription: boolean; emailSent: boolean } | null>(null)
  const [paymentForm, setPaymentForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    cardName: '',
  })

  useEffect(() => {
    if (user?.email && paymentForm.email === '')
      setPaymentForm((f) => ({ ...f, email: user.email ?? '' }))
  }, [user?.email])

  const subtotal = items.reduce((s, i) => s + i.basePrice * i.quantity, 0)
  const hasSubscription = items.some((i) => i.monthlyPrice > 0)

  async function handleRemove(index: number) {
    await removeFromCart(user?.uid ?? null, index)
    refresh()
  }

  async function handleQty(index: number, delta: number) {
    const item = items[index]
    if (!item) return
    const newQty = item.quantity + delta
    if (newQty < 1) return
    await updateQuantity(user?.uid ?? null, index, newQty)
    refresh()
  }

  function openModal() {
    if (!user) {
      navigate('/connexion', { state: { requireAuth: true, returnTo: '/panier' } })
      return
    }
    setPaymentError('')
    setPaymentSuccess(null)
    setPaymentForm((f) => ({ ...f, email: user.email ?? f.email }))
    setModalOpen(true)
  }

  async function handlePaymentSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPaymentError('')
    setPaying(true)
    try {
      const orderNumber = 'CMD-' + Date.now().toString(36).toUpperCase()
      const total = subtotal
      const deliveryAddress = `${paymentForm.address}, ${paymentForm.postalCode} ${paymentForm.city}`
      const customerName = `${paymentForm.firstName} ${paymentForm.lastName}`

      const emailResult = await sendOrderEmail({
        to_email: paymentForm.email,
        to_name: customerName,
        order_number: orderNumber,
        order_total: formatPrice(total),
        order_date: new Date().toLocaleDateString('fr-FR'),
        has_subscription: hasSubscription ? 'Oui' : 'Non',
        delivery_address: deliveryAddress,
        customer_name: customerName,
      })

      await setDoc(doc(db, 'orders', orderNumber), {
        orderNumber,
        userId: user?.uid ?? null,
        customerEmail: paymentForm.email,
        customerName,
        deliveryAddress: { address: paymentForm.address, city: paymentForm.city, postalCode: paymentForm.postalCode },
        items,
        total,
        hasSubscription,
        createdAt: serverTimestamp(),
        status: 'confirmed',
      })

      if (hasSubscription && user?.uid) {
        const profileResult = await updateUserProfile(user.uid, { hasSubscription: true })
        if (!profileResult.success) console.warn('Profil abonnement:', profileResult.error)
      }
      await clearCart(user?.uid ?? null)
      refresh()
      setModalOpen(false)
      setPaymentSuccess({
        orderNumber,
        email: paymentForm.email,
        hasSubscription,
        emailSent: emailResult.success,
      })
    } catch (err) {
      console.error(err)
      setPaymentError('Une erreur est survenue. Vérifiez vos informations et réessayez.')
    } finally {
      setPaying(false)
    }
  }

  if (loading) return <div className="text-center py-12">Chargement du panier...</div>

  if (items.length === 0 && !modalOpen) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 rounded-full bg-border-soft flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-text-muted">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-[#1a1d21] mb-2">Votre panier est vide</h2>
        <p className="text-text-muted text-center mb-6">
          Il n&apos;y a aucun article dans votre panier.<br />Découvrez nos bâtons connectés et ajoutez votre premier produit.
        </p>
        <Link to="/produit" className="bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3 rounded-lg">
          Découvrir nos produits
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1000px] mx-auto">
      {paymentSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800" role="status">
          <p className="font-semibold">Commande validée !</p>
          <p className="text-sm mt-1">Numéro : <strong>{paymentSuccess.orderNumber}</strong></p>
          <p className="text-sm">{paymentSuccess.emailSent ? `Un email de confirmation a été envoyé à ${paymentSuccess.email}.` : `Commande enregistrée. L’envoi de l’email à ${paymentSuccess.email} a échoué.`}</p>
          {paymentSuccess.hasSubscription && <p className="text-sm mt-1">Votre compte est maintenant Premium.</p>}
        </div>
      )}
      {!user && items.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex flex-wrap items-center gap-2">
          <span>Pour valider votre commande et lier un abonnement à votre compte,</span>
          <Link to="/connexion" state={{ requireAuth: true, returnTo: '/panier' }} className="font-medium underline">connectez-vous</Link>
          <span>ou</span>
          <Link to="/inscription" state={{ requireAuth: true, returnTo: '/panier' }} className="font-medium underline">créez un compte</Link>.
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1a1d21]">Votre panier</h1>
        <p className="text-text-muted text-sm">Révisez vos articles avant de finaliser votre commande</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex gap-4 p-4 bg-white rounded-xl border border-border-soft">
              <div className="flex-1">
                <p className="font-medium text-[#1a1d21]">{item.name}</p>
                <p className="text-sm text-text-muted">
                  {item.plan === 'avec' ? 'Avec abonnement 9,99 €/mois' : 'Sans abonnement'}
                </p>
                <p className="text-cta font-semibold mt-1">{formatPrice(item.basePrice * item.quantity)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => handleQty(index, -1)} className="w-8 h-8 rounded border border-border-soft flex items-center justify-center">−</button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button type="button" onClick={() => handleQty(index, 1)} className="w-8 h-8 rounded border border-border-soft flex items-center justify-center">+</button>
              </div>
              <button type="button" onClick={() => handleRemove(index)} className="text-red-600 hover:underline text-sm">Supprimer</button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-border-soft p-6 h-fit">
          <h2 className="font-semibold text-[#1a1d21] mb-4">Résumé de la commande</h2>
          <div className="flex justify-between text-sm mb-2"><span>Sous-total</span><span>{formatPrice(subtotal)}</span></div>
          <div className="flex justify-between text-sm mb-2"><span>Livraison</span><span className="text-cta">Gratuite</span></div>
          <hr className="border-border-soft my-4" />
          <div className="flex justify-between font-semibold text-lg mb-6"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
          <button
            type="button"
            onClick={openModal}
            className="w-full bg-cta hover:bg-cta-hover text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2"
          >
            Valider mon achat{' '}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <p className="text-xs text-text-muted mt-3 flex items-center gap-1">
            <span className="inline-block w-4 h-4">🔒</span> Paiement sécurisé
          </p>
        </div>
      </div>

      {modalOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[100]" onClick={() => !paying && setModalOpen(false)} />
          <div className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl z-[101] p-6">
            <button type="button" onClick={() => !paying && setModalOpen(false)} disabled={paying} className="absolute top-4 right-4 text-text-muted hover:text-[#1a1d21] disabled:opacity-50" aria-label="Fermer">✕</button>
            <h2 className="text-xl font-semibold mb-1">Finaliser votre commande</h2>
            <p className="text-sm text-text-muted mb-4">Paiement sécurisé – Simulation</p>

            {paymentError && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm" role="alert">{paymentError}</div>}

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <h3 className="font-medium text-sm mb-2">Informations de livraison</h3>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="Prénom" required value={paymentForm.firstName} onChange={(e) => setPaymentForm((f) => ({ ...f, firstName: e.target.value }))} disabled={paying} className="w-full px-3 py-2 border border-border-soft rounded-lg disabled:opacity-60 disabled:bg-gray-50" />
                  <input type="text" placeholder="Nom" required value={paymentForm.lastName} onChange={(e) => setPaymentForm((f) => ({ ...f, lastName: e.target.value }))} disabled={paying} className="w-full px-3 py-2 border border-border-soft rounded-lg disabled:opacity-60 disabled:bg-gray-50" />
                </div>
                <input type="email" placeholder="Email" required value={paymentForm.email} onChange={(e) => setPaymentForm((f) => ({ ...f, email: e.target.value }))} disabled={paying} className="w-full px-3 py-2 border border-border-soft rounded-lg mt-2 disabled:opacity-60 disabled:bg-gray-50" />
                <input type="text" placeholder="Adresse" required value={paymentForm.address} onChange={(e) => setPaymentForm((f) => ({ ...f, address: e.target.value }))} disabled={paying} className="w-full px-3 py-2 border border-border-soft rounded-lg mt-2 disabled:opacity-60 disabled:bg-gray-50" />
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <input type="text" placeholder="Ville" required value={paymentForm.city} onChange={(e) => setPaymentForm((f) => ({ ...f, city: e.target.value }))} disabled={paying} className="w-full px-3 py-2 border border-border-soft rounded-lg disabled:opacity-60 disabled:bg-gray-50" />
                  <input type="text" placeholder="Code postal" required pattern="[0-9]{5}" value={paymentForm.postalCode} onChange={(e) => setPaymentForm((f) => ({ ...f, postalCode: e.target.value }))} disabled={paying} className="w-full px-3 py-2 border border-border-soft rounded-lg disabled:opacity-60 disabled:bg-gray-50" />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm mb-2">Informations de paiement</h3>
                <input type="text" placeholder="Numéro de carte" required value={paymentForm.cardNumber} onChange={(e) => setPaymentForm((f) => ({ ...f, cardNumber: e.target.value }))} disabled={paying} className="w-full px-3 py-2 border border-border-soft rounded-lg mb-2 disabled:opacity-60 disabled:bg-gray-50" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="MM/AA" required value={paymentForm.cardExpiry} onChange={(e) => setPaymentForm((f) => ({ ...f, cardExpiry: e.target.value }))} disabled={paying} className="w-full px-3 py-2 border border-border-soft rounded-lg disabled:opacity-60 disabled:bg-gray-50" />
                  <input type="text" placeholder="CVV" required value={paymentForm.cardCVC} onChange={(e) => setPaymentForm((f) => ({ ...f, cardCVC: e.target.value }))} disabled={paying} className="w-full px-3 py-2 border border-border-soft rounded-lg disabled:opacity-60 disabled:bg-gray-50" />
                </div>
                <input type="text" placeholder="Nom sur la carte" required value={paymentForm.cardName} onChange={(e) => setPaymentForm((f) => ({ ...f, cardName: e.target.value }))} disabled={paying} className="w-full px-3 py-2 border border-border-soft rounded-lg mt-2 disabled:opacity-60 disabled:bg-gray-50" />
              </div>
              <div className="flex justify-between font-semibold py-2"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setModalOpen(false)} disabled={paying} className="flex-1 py-2 border border-border-soft rounded-lg disabled:opacity-50">Annuler</button>
                <button type="submit" disabled={paying} className="flex-1 bg-cta hover:bg-cta-hover text-white py-2 rounded-lg disabled:opacity-50">
                  {paying ? 'Traitement...' : 'Payer'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

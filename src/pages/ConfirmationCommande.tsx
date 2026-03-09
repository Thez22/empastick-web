import { Link, useLocation } from 'react-router-dom'
import type { CartItem } from '../lib/cart'

function formatPrice(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)
}

export type ConfirmationState = {
  orderNumber: string
  email: string
  hasSubscription: boolean
  emailSent: boolean
  total: number
  items: CartItem[]
}

export default function ConfirmationCommande() {
  const location = useLocation()
  const state = location.state as ConfirmationState | null

  if (!state?.orderNumber) {
    return (
      <div className="max-w-[600px] mx-auto text-center py-16">
        <h1 className="text-2xl font-semibold text-[#1a1d21] mb-4">Confirmation de commande</h1>
        <p className="text-text-muted mb-6">Aucune commande à afficher. Vous avez peut-être rechargé la page.</p>
        <Link to="/" className="bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3 rounded-lg inline-block">
          Retour à l&apos;accueil
        </Link>
      </div>
    )
  }

  const { orderNumber, email, hasSubscription, emailSent, total, items } = state

  return (
    <div className="max-w-[640px] mx-auto py-8 sm:py-12">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-600">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#1a1d21] mb-2">Commande confirmée</h1>
        <p className="text-text-muted">Merci pour votre achat. Voici le récapitulatif de votre commande.</p>
      </div>

      <div className="bg-white rounded-2xl border border-border-soft shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border-soft bg-[#f8f7f4]/50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-text-muted">Numéro de commande</p>
              <p className="text-xl font-semibold text-[#1a1d21]">{orderNumber}</p>
            </div>
            <p className="text-sm text-text-muted">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="p-6">
          <h2 className="font-semibold text-[#1a1d21] mb-4">Récapitulatif</h2>
          <ul className="space-y-3 mb-6">
            {items.map((item, index) => (
              <li key={index} className="flex justify-between text-sm">
                <span className="text-[#1a1d21]">
                  {item.name} × {item.quantity}
                  {item.plan === 'avec' && <span className="text-text-muted ml-1">(avec abonnement)</span>}
                </span>
                <span className="font-medium">{formatPrice(item.basePrice * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-semibold text-lg pt-4 border-t border-border-soft">
            <span>Total</span>
            <span className="text-cta">{formatPrice(total)}</span>
          </div>
        </div>

        <div className="p-6 bg-[#f8f7f4]/50 border-t border-border-soft space-y-3">
          <p className="text-sm text-[#1a1d21]">
            <strong>Email de confirmation :</strong>{' '}
            {emailSent ? (
              <>Un email a été envoyé à <span className="font-medium">{email}</span>.</>
            ) : (
              <>L’envoi de l’email à <span className="font-medium">{email}</span> n’a pas abouti. Conservez bien ce numéro de commande.</>
            )}
          </p>
          {hasSubscription && (
            <p className="text-sm text-cta font-medium">Votre compte est maintenant Premium.</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/produit" className="border border-border-soft text-[#1a1d21] font-medium px-6 py-3 rounded-lg text-center hover:bg-gray-50">
          Continuer mes achats
        </Link>
        <Link to="/" className="bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3 rounded-lg text-center">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  )
}

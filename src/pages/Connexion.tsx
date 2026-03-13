import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { signIn, sendPasswordReset } from '../lib/auth'
import { getCart, saveCart } from '../lib/cart'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

export default function Connexion() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { refresh } = useCart()
  const state = location.state as { requireAuth?: boolean; returnTo?: string } | null
  const returnTo = state?.returnTo ?? '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [resetError, setResetError] = useState('')

  useEffect(() => {
    document.title = 'Connexion – Empastick'
  }, [])

  if (user) {
    navigate(returnTo, { replace: true })
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    const result = await signIn(email, password)
    setLoading(false)
    if (result.success) {
      setSuccess('Connexion réussie ! Redirection...')
      if (result.user?.id) {
        const localCart = await getCart(null)
        if (localCart.length > 0) {
          await saveCart(result.user.id, localCart)
          refresh()
        }
      }
      setTimeout(() => navigate(returnTo), 1000)
    } else {
      setError(result.error ?? 'Erreur de connexion')
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    setResetError('')
    setResetSent(false)
    if (!email.trim()) {
      setResetError('Indiquez votre adresse email.')
      return
    }
    setLoading(true)
    const result = await sendPasswordReset(email.trim())
    setLoading(false)
    if (result.success) {
      setResetSent(true)
    } else {
      setResetError(result.error ?? 'Impossible d’envoyer l’email.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#f8f7f4]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <Link to="/" className="block mb-6 flex justify-center">
          <img src="/favicon.jpg" alt="Empastick" className="h-12 w-auto object-contain" />
        </Link>
        <h1 className="text-2xl font-semibold text-[#1a1d21] mb-1">CONNEXION</h1>
        <p className="text-text-muted text-sm mb-6">
          {state?.requireAuth
            ? 'Connectez-vous pour acheter et lier un abonnement à votre compte.'
            : 'Bienvenue sur votre espace personnel'}
        </p>
        <hr className="border-border-soft mb-6" />

        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm" role="alert">{error}</div>}
        {success && <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm" role="status">{success}</div>}

        {showResetPassword ? (
          <div className="space-y-4">
            <p className="text-sm text-text-muted">Saisissez l’email de votre compte. Nous vous enverrons un lien pour réinitialiser votre mot de passe.</p>
            {resetError && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm" role="alert">{resetError}</div>}
            {resetSent && <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm" role="status">Email envoyé ! Consultez votre boîte de réception (et les spams).</div>}
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-[#1a1d21] mb-1">ADRESSE E-MAIL</label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setResetError('') }}
                  placeholder="votre@email.com"
                  required
                  className="w-full px-4 py-2 border border-border-soft rounded-lg focus:ring-2 focus:ring-cta focus:border-cta"
                />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => { setShowResetPassword(false); setResetError(''); setResetSent(false); }} className="flex-1 py-2 border border-border-soft rounded-lg text-[#1a1d21]">Annuler</button>
                <button type="submit" disabled={loading} className="flex-1 bg-cta hover:bg-cta-hover text-white py-2 rounded-lg disabled:opacity-50">Envoyer le lien</button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#1a1d21] mb-1">ADRESSE E-MAIL</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="w-full px-4 py-2 border border-border-soft rounded-lg focus:ring-2 focus:ring-cta focus:border-cta"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#1a1d21] mb-1">MOT DE PASSE</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2 border border-border-soft rounded-lg focus:ring-2 focus:ring-cta focus:border-cta"
                />
                <button type="button" onClick={() => setShowResetPassword(true)} className="mt-1 text-sm text-cta hover:underline">Mot de passe oublié ?</button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cta hover:bg-cta-hover text-white font-medium py-3 rounded-lg disabled:opacity-50"
              >
                SE CONNECTER
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-text-muted">
              <Link to="/inscription" state={state ?? undefined} className="text-cta hover:underline">Créer un compte</Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

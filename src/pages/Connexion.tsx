import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn } from '../lib/auth'
import { getCart, saveCart } from '../lib/cart'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

export default function Connexion() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { refresh } = useCart()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) {
    navigate('/', { replace: true })
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
      setTimeout(() => navigate('/'), 1000)
    } else {
      setError(result.error ?? 'Erreur de connexion')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#f8f7f4]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <Link to="/" className="block mb-6">
          <img src="/images/empastick.png" alt="Empastick" className="h-10 w-auto" />
        </Link>
        <h1 className="text-2xl font-semibold text-[#1a1d21] mb-1">CONNEXION</h1>
        <p className="text-text-muted text-sm mb-6">Bienvenue sur votre espace personnel</p>
        <hr className="border-border-soft mb-6" />

        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
        {success && <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm">{success}</div>}

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
          <Link to="/inscription" className="text-cta hover:underline">Créer un compte</Link>
        </div>
      </div>
    </div>
  )
}

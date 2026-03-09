import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../lib/auth'
import { useAuth } from '../contexts/AuthContext'

const BLOOD_OPTIONS = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Je ne sais pas']

export default function Inscription() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    naissance: '',
    email: '',
    password: '',
    sang: '',
    allergies: '',
    medical: '',
    urgence1_nom: '',
    urgence1_tel: '',
    urgence2_nom: '',
    urgence2_tel: '',
    urgence3_nom: '',
    urgence3_tel: '',
    cgu: false,
  })

  if (user) {
    navigate('/', { replace: true })
    return null
  }

  function update(name: string, value: string | boolean) {
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!form.cgu) {
      setError('Veuillez accepter les conditions générales.')
      return
    }
    setLoading(true)
    const contactsUrgence = []
    if (form.urgence1_nom && form.urgence1_tel) contactsUrgence.push({ nom: form.urgence1_nom, telephone: form.urgence1_tel })
    if (form.urgence2_nom && form.urgence2_tel) contactsUrgence.push({ nom: form.urgence2_nom, telephone: form.urgence2_tel })
    if (form.urgence3_nom && form.urgence3_tel) contactsUrgence.push({ nom: form.urgence3_nom, telephone: form.urgence3_tel })

    const result = await signUp(form.email, form.password, {
      displayName: `${form.prenom} ${form.nom}`.trim() || 'Utilisateur',
      nom: form.nom,
      prenom: form.prenom,
      dateNaissance: form.naissance,
      groupeSanguin: form.sang || undefined,
      allergies: form.allergies || undefined,
      traitements: form.medical || undefined,
      contactsUrgence,
    })
    setLoading(false)
    if (result.success) {
      setSuccess('Inscription réussie ! Redirection...')
      setTimeout(() => navigate('/'), 1500)
    } else {
      setError(result.error ?? "Erreur lors de l'inscription")
    }
  }

  const inputClass = 'w-full px-4 py-2 border border-border-soft rounded-lg focus:ring-2 focus:ring-cta focus:border-cta'
  const labelClass = 'block text-sm font-medium text-[#1a1d21] mb-1'

  return (
    <div className="min-h-screen py-12 px-4 bg-[#f8f7f4]">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-[#1a1d21] mb-1">Créer un compte</h1>
        <p className="text-text-muted text-sm mb-6">Rejoignez la communauté Empastick</p>

        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
        {success && <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <section>
            <h2 className="text-lg font-medium text-[#1a1d21] mb-4">1. Informations personnelles</h2>
            <div className="space-y-4">
              <div><label className={labelClass}>Nom *</label><input type="text" className={inputClass} value={form.nom} onChange={(e) => update('nom', e.target.value)} placeholder="Votre nom" required /></div>
              <div><label className={labelClass}>Prénom *</label><input type="text" className={inputClass} value={form.prenom} onChange={(e) => update('prenom', e.target.value)} placeholder="Votre prénom" required /></div>
              <div><label className={labelClass}>Date de naissance *</label><input type="date" className={inputClass} value={form.naissance} onChange={(e) => update('naissance', e.target.value)} required /></div>
              <div><label className={labelClass}>Email *</label><input type="email" className={inputClass} value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="exemple@email.com" required /></div>
              <div><label className={labelClass}>Mot de passe *</label><input type="password" className={inputClass} value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="8 caractères minimum" required minLength={8} /></div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1a1d21] mb-2">2. Fiche santé</h2>
            <p className="text-xs text-text-muted mb-4">Ces informations resteront confidentielles et serviront uniquement en cas d&apos;urgence.</p>
            <div className="space-y-4">
              <div><label className={labelClass}>Groupe sanguin *</label><select className={inputClass} value={form.sang} onChange={(e) => update('sang', e.target.value)} required><option value="">-- Sélectionner --</option>{BLOOD_OPTIONS.filter(Boolean).map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
              <div><label className={labelClass}>Allergies connues</label><textarea className={inputClass} rows={2} value={form.allergies} onChange={(e) => update('allergies', e.target.value)} placeholder="Si aucune, écrire Aucune" /></div>
              <div><label className={labelClass}>Traitements / Pathologies</label><textarea className={inputClass} rows={2} value={form.medical} onChange={(e) => update('medical', e.target.value)} placeholder="Ex: Asthme, Diabète..." /></div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1a1d21] mb-2">3. Contact(s)</h2>
            <p className="text-xs text-text-muted mb-4">Merci de renseigner 3 personnes à contacter en priorité.</p>
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Contact n°1 *</h3>
              <div><label className={labelClass}>Nom & Prénom</label><input type="text" className={inputClass} value={form.urgence1_nom} onChange={(e) => update('urgence1_nom', e.target.value)} required /></div>
              <div><label className={labelClass}>Téléphone</label><input type="tel" className={inputClass} value={form.urgence1_tel} onChange={(e) => update('urgence1_tel', e.target.value)} placeholder="06 00 00 00 00" required /></div>
              <h3 className="font-medium text-sm pt-2">Contact n°2</h3>
              <div><label className={labelClass}>Nom & Prénom</label><input type="text" className={inputClass} value={form.urgence2_nom} onChange={(e) => update('urgence2_nom', e.target.value)} required /></div>
              <div><label className={labelClass}>Téléphone</label><input type="tel" className={inputClass} value={form.urgence2_tel} onChange={(e) => update('urgence2_tel', e.target.value)} required /></div>
              <h3 className="font-medium text-sm pt-2">Contact n°3</h3>
              <div><label className={labelClass}>Nom & Prénom</label><input type="text" className={inputClass} value={form.urgence3_nom} onChange={(e) => update('urgence3_nom', e.target.value)} /></div>
              <div><label className={labelClass}>Téléphone</label><input type="tel" className={inputClass} value={form.urgence3_tel} onChange={(e) => update('urgence3_tel', e.target.value)} /></div>
            </div>
          </section>

          <div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={form.cgu} onChange={(e) => update('cgu', e.target.checked)} required className="mt-1" />
              <span className="text-sm">J&apos;accepte les <a href="/politique" target="_blank" rel="noopener noreferrer" className="text-cta underline">conditions générales d&apos;utilisation</a> *</span>
            </label>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-cta hover:bg-cta-hover text-white font-medium py-3 rounded-lg disabled:opacity-50">VALIDER MON INSCRIPTION</button>
        </form>

        <p className="mt-6 text-center text-sm"><Link to="/connexion" className="text-cta hover:underline">Retour à la connexion</Link></p>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signOut, getUserData, updateUserProfile } from '../lib/auth'
import type { UserData } from '../lib/auth'
import { useAuth } from '../contexts/AuthContext'

type EditForm = {
  displayName: string
  prenom: string
  nom: string
  dateNaissance: string
  groupeSanguin: string
  allergies: string
  traitements: string
}

export default function Profil() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState<EditForm>({ displayName: '', prenom: '', nom: '', dateNaissance: '', groupeSanguin: '', allergies: '', traitements: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    getUserData(user.uid).then((data) => {
      const p = data ?? { id: user.uid, email: user.email ?? null, displayName: user.displayName ?? null, hasSubscription: false }
      setProfile(p)
      if (data) setEditForm({ displayName: data.displayName ?? '', prenom: data.prenom ?? '', nom: data.nom ?? '', dateNaissance: data.dateNaissance ?? '', groupeSanguin: data.groupeSanguin ?? '', allergies: data.allergies ?? '', traitements: data.traitements ?? '' })
      setLoading(false)
    })
  }, [user])

  async function handleLogout() {
    if (!confirm('Voulez-vous vraiment vous déconnecter ?')) return
    await signOut()
    navigate('/connexion')
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    await updateUserProfile(user.uid, { ...editForm })
    setProfile((prev: UserData | null) => (prev ? { ...prev, ...editForm } : null))
    setEditOpen(false)
    setSaving(false)
  }

  if (!user && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-[#1a1d21] mb-4">Vous devez être connecté pour accéder à votre profil.</p>
        <Link to="/connexion" className="bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3 rounded-lg">Se connecter</Link>
      </div>
    )
  }

  if (loading) return <div className="text-center py-12">Chargement de votre profil...</div>

  const initials = (profile?.prenom?.[0] ?? '') + (profile?.nom?.[0] ?? '') || profile?.displayName?.slice(0, 2)?.toUpperCase() || 'U'

  return (
    <div className="max-w-[700px] mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-cta/20 flex items-center justify-center text-cta text-xl font-semibold">{initials}</div>
          <div>
            <h1 className="text-xl font-semibold text-[#1a1d21]">{profile?.displayName ?? 'Utilisateur'}</h1>
            <p className="text-text-muted text-sm">{profile?.email}</p>
            <span className="inline-flex items-center gap-1 mt-1 text-sm text-cta">{profile?.hasSubscription ? 'Membre Premium' : 'Membre standard'}</span>
          </div>
        </div>
        <button type="button" onClick={() => setEditOpen(true)} className="flex items-center gap-2 px-4 py-2 border border-cta text-cta rounded-lg hover:bg-cta/5">Modifier</button>
      </div>

      <section className="bg-white rounded-xl border border-border-soft p-6 mb-6">
        <h2 className="font-semibold text-[#1a1d21] mb-4">Informations personnelles</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-text-muted">Nom</span><span>{profile?.nom ?? '-'}</span></div>
          <div className="flex justify-between"><span className="text-text-muted">Prénom</span><span>{profile?.prenom ?? '-'}</span></div>
          <div className="flex justify-between"><span className="text-text-muted">Date de naissance</span><span>{profile?.dateNaissance ?? '-'}</span></div>
          <div className="flex justify-between"><span className="text-text-muted">Email</span><span>{profile?.email ?? '-'}</span></div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-border-soft p-6 mb-6">
        <h2 className="font-semibold text-[#1a1d21] mb-4">Fiche santé</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-text-muted">Groupe sanguin</span><span>{profile?.groupeSanguin ?? '-'}</span></div>
          <div className="flex justify-between"><span className="text-text-muted">Allergies</span><span>{profile?.allergies ?? '-'}</span></div>
          <div className="flex justify-between"><span className="text-text-muted">Traitements / Pathologies</span><span>{profile?.traitements ?? '-'}</span></div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-border-soft p-6 mb-6">
        <h2 className="font-semibold text-[#1a1d21] mb-4">Contacts d&apos;urgence</h2>
        {Array.isArray(profile?.contactsUrgence) && profile.contactsUrgence.length > 0 ? (
          <ul className="space-y-2 text-sm">{(profile.contactsUrgence as { nom?: string; telephone?: string }[]).map((c, i) => <li key={i}>{c.nom} – {c.telephone}</li>)}</ul>
        ) : (
          <p className="text-text-muted text-sm">Aucun contact d&apos;urgence enregistré</p>
        )}
      </section>

      <button type="button" onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50">Se déconnecter</button>

      {editOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[100]" onClick={() => setEditOpen(false)} />
          <div className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl z-[101] p-6">
            <h2 className="text-xl font-semibold mb-4">Modifier mon profil</h2>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Prénom</label><input type="text" className="w-full px-3 py-2 border rounded-lg" value={editForm.prenom} onChange={(e) => setEditForm((f: EditForm) => ({ ...f, prenom: e.target.value }))} /></div>
              <div><label className="block text-sm font-medium mb-1">Nom</label><input type="text" className="w-full px-3 py-2 border rounded-lg" value={editForm.nom} onChange={(e) => setEditForm((f: EditForm) => ({ ...f, nom: e.target.value }))} /></div>
              <div><label className="block text-sm font-medium mb-1">Nom complet</label><input type="text" className="w-full px-3 py-2 border rounded-lg" value={editForm.displayName} onChange={(e) => setEditForm((f: EditForm) => ({ ...f, displayName: e.target.value }))} /></div>
              <div><label className="block text-sm font-medium mb-1">Date de naissance</label><input type="date" className="w-full px-3 py-2 border rounded-lg" value={editForm.dateNaissance} onChange={(e) => setEditForm((f: EditForm) => ({ ...f, dateNaissance: e.target.value }))} /></div>
              <div><label className="block text-sm font-medium mb-1">Groupe sanguin</label><input type="text" className="w-full px-3 py-2 border rounded-lg" value={editForm.groupeSanguin} onChange={(e) => setEditForm((f: EditForm) => ({ ...f, groupeSanguin: e.target.value }))} /></div>
              <div><label className="block text-sm font-medium mb-1">Allergies</label><textarea className="w-full px-3 py-2 border rounded-lg" rows={2} value={editForm.allergies} onChange={(e) => setEditForm((f: EditForm) => ({ ...f, allergies: e.target.value }))} /></div>
              <div><label className="block text-sm font-medium mb-1">Traitements</label><textarea className="w-full px-3 py-2 border rounded-lg" rows={2} value={editForm.traitements} onChange={(e) => setEditForm((f: EditForm) => ({ ...f, traitements: e.target.value }))} /></div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setEditOpen(false)} className="flex-1 py-2 border rounded-lg">Annuler</button>
                <button type="submit" disabled={saving} className="flex-1 bg-cta hover:bg-cta-hover text-white py-2 rounded-lg disabled:opacity-50">Enregistrer</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

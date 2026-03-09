import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  User,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

/** Messages d'erreur Firebase en français pour l'UI */
const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'Cet email est déjà utilisé par un compte existant.',
  'auth/invalid-email': 'L’adresse email n’est pas valide.',
  'auth/operation-not-allowed': 'Cette opération n’est pas autorisée. Contactez le support.',
  'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères.',
  'auth/user-disabled': 'Ce compte a été désactivé. Contactez le support.',
  'auth/user-not-found': 'Aucun compte associé à cet email.',
  'auth/wrong-password': 'Mot de passe incorrect.',
  'auth/invalid-credential': 'Email ou mot de passe incorrect.',
  'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard ou réinitialisez votre mot de passe.',
  'auth/network-request-failed': 'Erreur réseau. Vérifiez votre connexion.',
  'auth/requires-recent-login': 'Pour des raisons de sécurité, reconnectez-vous puis réessayez.',
  'auth/invalid-verification-code': 'Code de vérification invalide.',
  'auth/invalid-verification-id': 'Lien de réinitialisation invalide ou expiré.',
  'auth/expired-action-code': 'Ce lien a expiré. Demandez une nouvelle réinitialisation.',
  'auth/invalid-action-code': 'Ce lien n’est pas valide. Demandez une nouvelle réinitialisation.',
}

export function getAuthErrorMessage(e: unknown): string {
  const err = e as Error & { code?: string }
  const code = err?.code ?? ''
  return FIREBASE_ERROR_MESSAGES[code] ?? err?.message ?? 'Une erreur est survenue. Veuillez réessayer.'
}

export interface UserData {
  id: string
  email: string | null
  displayName: string | null
  nom?: string
  prenom?: string
  dateNaissance?: string
  groupeSanguin?: string
  allergies?: string
  traitements?: string
  contactsUrgence?: unknown[]
  hasSubscription?: boolean
}

export async function signUp(
  email: string,
  password: string,
  userData: Partial<UserData> & { displayName?: string; prenom?: string; nom?: string }
): Promise<{ success: boolean; user?: UserData; error?: string }> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    const user = cred.user
    const displayName = userData.displayName || [userData.prenom, userData.nom].filter(Boolean).join(' ') || 'Utilisateur'
    await updateProfile(user, { displayName })
    const userDoc: UserData = {
      id: user.uid,
      email: user.email ?? null,
      displayName,
      hasSubscription: false,
      nom: userData.nom,
      prenom: userData.prenom,
      dateNaissance: userData.dateNaissance,
      groupeSanguin: userData.groupeSanguin,
      allergies: userData.allergies,
      traitements: userData.traitements,
      contactsUrgence: userData.contactsUrgence ?? [],
    }
    await setDoc(doc(db, 'users', user.uid), userDoc, { merge: true })
    return { success: true, user: userDoc }
  } catch (e: unknown) {
    return { success: false, error: getAuthErrorMessage(e) }
  }
}

export async function signIn(email: string, password: string): Promise<{ success: boolean; user?: UserData; error?: string }> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const user = cred.user
    const snap = await getDoc(doc(db, 'users', user.uid))
    if (snap.exists()) return { success: true, user: snap.data() as UserData }
    const minimal: UserData = { id: user.uid, email: user.email ?? null, displayName: user.displayName ?? email.split('@')[0], hasSubscription: false }
    await setDoc(doc(db, 'users', user.uid), minimal, { merge: true })
    return { success: true, user: minimal }
  } catch (e: unknown) {
    return { success: false, error: getAuthErrorMessage(e) }
  }
}

export async function sendPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    await sendPasswordResetEmail(auth, email)
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: getAuthErrorMessage(e) }
  }
}

export async function signOut(): Promise<void> {
  await fbSignOut(auth)
}

export function getCurrentUser(): User | null {
  return auth.currentUser
}

export function subscribeAuth(cb: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, cb)
}

export async function getUserData(uid: string): Promise<UserData | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid))
    return snap.exists() ? (snap.data() as UserData) : null
  } catch {
    return null
  }
}

export async function updateUserProfile(uid: string, data: Partial<UserData>): Promise<{ success: boolean; error?: string }> {
  try {
    await setDoc(doc(db, 'users', uid), data, { merge: true })
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: getAuthErrorMessage(e) }
  }
}

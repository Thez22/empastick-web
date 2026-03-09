import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  User,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

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
    return { success: false, error: (e as Error).message }
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
    return { success: false, error: (e as Error).message }
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

export async function updateUserProfile(uid: string, data: Partial<UserData>): Promise<void> {
  await setDoc(doc(db, 'users', uid), data, { merge: true })
}

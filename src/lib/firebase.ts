import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDduen2D5QTH2l6mW4fhftudWOX-eA68Os',
  authDomain: 'empastick-v2.firebaseapp.com',
  projectId: 'empastick-v2',
  storageBucket: 'gs://empastick-v2.firebasestorage.app',
  messagingSenderId: '556195523356',
  appId: '1:556195523356:web:6c467c444a636d2ee928d9',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

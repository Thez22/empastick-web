import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import Accueil from './pages/Accueil'
import Produit from './pages/Produit'
import APropos from './pages/APropos'
import Connexion from './pages/Connexion'
import Inscription from './pages/Inscription'
import Panier from './pages/Panier'
import Profil from './pages/Profil'
import MentionsLegales from './pages/MentionsLegales'
import Politique from './pages/Politique'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Accueil />} />
            <Route path="produit" element={<Produit />} />
            <Route path="a-propos" element={<APropos />} />
            <Route path="panier" element={<Panier />} />
            <Route path="profil" element={<Profil />} />
            <Route path="mentions-legales" element={<MentionsLegales />} />
            <Route path="politique" element={<Politique />} />
          </Route>
          <Route path="connexion" element={<Connexion />} />
          <Route path="inscription" element={<Inscription />} />
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}

# Empastick (refonte)

Site Empastick refait avec **Vite + React + TypeScript + Tailwind CSS + React Router**.  
Même fonctionnalités que le site d’origine (Firebase Auth, Firestore panier/commandes/utilisateurs, EmailJS pour les mails de commande).

## Prérequis

- Node.js 18+
- Compte Firebase (Auth + Firestore) et EmailJS déjà configurés comme sur l’ancien site

## Installation

```bash
npm install
```

## Copie des images

Les assets sont dans `public/images/` (déjà copiés depuis `empastick (final j crois)/code simeed/images/`).  
Si besoin, recopier ce dossier dans `public/images/`.

## Développement

```bash
npm run dev
```

Ouvre http://localhost:5173 (ou le port indiqué).

## Build

```bash
npm run build
```

Sortie dans `dist/`.

## Structure

- `src/lib/` : Firebase, auth, panier (Firestore + localStorage), EmailJS
- `src/contexts/` : AuthContext, CartContext
- `src/components/` : Header, Footer, Layout, CookieBanner
- `src/pages/` : Accueil, Produit, À propos, Connexion, Inscription, Panier, Profil, Mentions légales, Politique, 404

## Configuration

- **Firebase** : `src/lib/firebase.ts` (même config que l’ancien site)
- **EmailJS** : `src/lib/emailjs.ts` (service, template, clé publique)

Charte : vert CTA `#0b5b33`, orange `#EB5E4E`, vert foncé `#064e3b`, police Inter + Playfair Display pour les titres.

---

## Déploiement (GitHub + Vercel)

1. **Créer un dépôt sur GitHub**  
   - Va sur [github.com/new](https://github.com/new).  
   - Nom du repo : `empastick-web` (ou autre).  
   - Ne coche pas « Initialize with README » (le projet en a déjà un).  
   - Crée le dépôt.

2. **Pousser le code** (dans le dossier `empastick-web`) :
   ```bash
   git remote add origin https://github.com/TON_USERNAME/empastick-web.git
   git branch -M main
   git push -u origin main
   ```
   Remplace `TON_USERNAME` par ton identifiant GitHub.

3. **Connecter à Vercel**  
   - Va sur [vercel.com](https://vercel.com) et connecte-toi avec GitHub.  
   - « Add New Project » → importe le repo `empastick-web`.  
   - **Build Command** : `npm run build`  
   - **Output Directory** : `dist`  
   - **Install Command** : `npm install`  
   - Ajoute les variables d’environnement si tu utilises des `.env` (Firebase, EmailJS).  
   - Déploie.

Le fichier `vercel.json` configure les redirections pour que React Router (SPA) fonctionne correctement sur Vercel.

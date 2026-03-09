import { useState, useEffect } from 'react'

const STORAGE_KEY = 'empastick_cookies'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) setVisible(false)
    else setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[998] p-4 sm:p-5 bg-gradient-to-t from-slate-900/60 to-transparent flex justify-center">
      <div className="max-w-[720px] w-full bg-[#fdfbf5] rounded-2xl p-5 sm:p-6 shadow-lg border border-[#e9e4d6] text-sm">
        <h2 className="font-semibold text-[#1a1d21] m-0 mb-1">Gestion des cookies</h2>
        <p className="text-text-muted m-0 mb-3">
          Nous utilisons des cookies pour améliorer votre expérience sur Empastick (statistiques anonymes et bon fonctionnement du site).
          Vous pouvez accepter ou refuser ces cookies.
        </p>
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={decline} className="px-4 py-2 rounded-xl border border-border-soft bg-white font-medium hover:bg-gray-50">
            Refuser
          </button>
          <button type="button" onClick={accept} className="px-4 py-2 rounded-xl bg-cta text-white font-medium hover:bg-cta-hover">
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}

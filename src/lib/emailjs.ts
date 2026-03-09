import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export interface OrderEmailParams extends Record<string, unknown> {
  to_email: string
  to_name: string
  order_number: string
  order_total: string
  order_date: string
  has_subscription: string
  delivery_address: string
  customer_name: string
  message?: string
}

export async function sendOrderEmail(params: OrderEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    await emailjs.send(SERVICE_ID ?? '', TEMPLATE_ID ?? '', params, PUBLIC_KEY ?? '')
    return { success: true }
  } catch (e: unknown) {
    const err = e as Error
    const msg = err?.message ?? 'Erreur inconnue'
    if (msg.includes('network') || msg.includes('Failed to fetch')) return { success: false, error: 'Erreur réseau. Vérifiez votre connexion.' }
    return { success: false, error: 'L’envoi de l’email de confirmation a échoué. Votre commande est enregistrée.' }
  }
}

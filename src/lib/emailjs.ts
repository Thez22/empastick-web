import emailjs from '@emailjs/browser'

const SERVICE_ID = 'service_l6r32a6'
const TEMPLATE_ID = 'template_bgsij4q'
const PUBLIC_KEY = '0yyup30cXVBSvL5bO'

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

export async function sendOrderEmail(params: OrderEmailParams): Promise<void> {
  await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, PUBLIC_KEY)
}

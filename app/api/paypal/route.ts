import { NextResponse } from 'next/server'
import paypal from '@paypal/checkout-server-sdk'

// PayPal client configuration
let client: paypal.core.PayPalHttpClient

function getPayPalClient() {
  if (client) return client

  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials are not set in the environment variables')
  }

  const environment = process.env.NODE_ENV === 'production'
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret)

  client = new paypal.core.PayPalHttpClient(environment)
  return client
}

export async function POST(request: Request) {
  const { amount, currency = 'USD' } = await request.json()

  try {
    const order = await createPayPalOrder(amount, currency)
    return NextResponse.json({ orderId: order.id })
  } catch (error) {
    console.error('Error creating PayPal order:', error)
    return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 })
  }
}

async function createPayPalOrder(amount: number, currency: string) {
  const request = new paypal.orders.OrdersCreateRequest()
  request.prefer("return=representation")
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: currency,
        value: amount.toString()
      }
    }]
  })

  const response = await getPayPalClient().execute(request)
  return response.result
}

export async function PUT(request: Request) {
  const { orderId } = await request.json()

  try {
    const captureData = await capturePayPalOrder(orderId)
    return NextResponse.json(captureData)
  } catch (error) {
    console.error('Error capturing PayPal payment:', error)
    return NextResponse.json({ error: 'Failed to capture PayPal payment' }, { status: 500 })
  }
}

async function capturePayPalOrder(orderId: string) {
  const request = new paypal.orders.OrdersCaptureRequest(orderId)
  request.requestBody({})

  const response = await getPayPalClient().execute(request)
  return response.result
}


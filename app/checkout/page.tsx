'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { Switch } from '@/components/ui/switch'

const paypalConfig = {
  "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
  currency: "USD",
  intent: "capture"
}

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState('stripe')
  const [autoRenewal, setAutoRenewal] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')
  const autoRenewalParam = searchParams.get('autoRenewal')

  useEffect(() => {
    if (autoRenewalParam) {
      setAutoRenewal(autoRenewalParam === 'true')
    }
  }, [autoRenewalParam])

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (paymentMethod === 'stripe') {
      // Implement Stripe payment
      router.push('/checkout/success')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Checkout</h1>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Complete Your Purchase</CardTitle>
          <CardDescription>You are subscribing to the {plan} plan</CardDescription>
        </CardHeader>
        <form onSubmit={handlePayment}>
          <CardContent>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="stripe" id="stripe" />
                <Label htmlFor="stripe" className="flex items-center">
                  <span className="mr-2">Credit Card (Stripe)</span>
                  <img src="/stripe-logo.png" alt="Stripe" className="h-6" />
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex items-center">
                  <span className="mr-2">PayPal</span>
                  <img src="/paypal-logo.png" alt="PayPal" className="h-6" />
                </Label>
              </div>
            </RadioGroup>
            {paymentMethod === 'stripe' && (
              <div className="mt-4 space-y-2">
                <Input type="text" placeholder="Card Number" />
                <div className="flex space-x-2">
                  <Input type="text" placeholder="MM/YY" className="w-1/2" />
                  <Input type="text" placeholder="CVC" className="w-1/2" />
                </div>
              </div>
            )}
            {paymentMethod === 'paypal' && (
              <div className="mt-4">
                <PayPalScriptProvider options={paypalConfig}>
                  <PayPalButtons 
                    style={{ layout: "vertical" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: plan === 'Premium' ? "9.99" : "19.99",
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order.capture().then((details) => {
                        router.push('/checkout/success');
                      });
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            )}
            <div className="mt-4 flex items-center space-x-2">
              <Switch
                id="auto-renewal"
                checked={autoRenewal}
                onCheckedChange={setAutoRenewal}
              />
              <Label htmlFor="auto-renewal">Enable Auto-renewal</Label>
            </div>
          </CardContent>
          <CardFooter>
            {paymentMethod === 'stripe' && (
              <Button type="submit" className="w-full">Complete Payment</Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}


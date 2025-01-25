'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [autoRenewal, setAutoRenewal] = useState(true)
  const router = useRouter()

  const handleSubscribe = (plan: string) => {
    setSelectedPlan(plan)
    router.push(`/checkout?plan=${plan}&autoRenewal=${autoRenewal}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Choose Your Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <PricingCard
          title="Free"
          price="$0"
          description="Basic access to word search puzzles"
          features={[
            '5 puzzles per day',
            'Access to easy difficulty',
            'Online play only',
            '10 downloads per day',
            'Access to first 5 levels'
          ]}
          buttonText="Get Started"
          buttonVariant="outline"
          onSubscribe={() => handleSubscribe('Free')}
        />
        <PricingCard
          title="Premium"
          price="$9.99"
          period="month"
          description="Full access to all puzzles and features"
          features={[
            'Unlimited puzzles',
            'All difficulty levels',
            'PDF and Word export',
            '25 downloads per day',
            'Ad-free experience',
            'Priority support',
          ]}
          buttonText="Subscribe Now"
          buttonVariant="default"
          onSubscribe={() => handleSubscribe('Premium')}
          popular
        />
        <PricingCard
          title="Family"
          price="$19.99"
          period="month"
          description="Share the fun with your family"
          features={[
            'Up to 5 accounts',
            'All Premium features',
            '40 downloads per day',
            'Parental controls',
            'Shared progress tracking',
          ]}
          buttonText="Choose Family Plan"
          buttonVariant="default"
          onSubscribe={() => handleSubscribe('Family')}
        />
      </div>
      <div className="mt-8 flex justify-center items-center space-x-4">
        <Switch
          id="auto-renewal"
          checked={autoRenewal}
          onCheckedChange={setAutoRenewal}
        />
        <Label htmlFor="auto-renewal">Enable Auto-renewal</Label>
      </div>
      <div className="mt-8 flex justify-center space-x-4">
        <Image src="/paypal-logo.png" alt="PayPal" width={100} height={50} />
        <Image src="/stripe-logo.png" alt="Stripe" width={100} height={50} />
      </div>
    </div>
  )
}

function PricingCard({
  title,
  price,
  period,
  description,
  features,
  buttonText,
  buttonVariant,
  onSubscribe,
  popular,
}: {
  title: string
  price: string
  period?: string
  description: string
  features: string[]
  buttonText: string
  buttonVariant: 'default' | 'outline'
  onSubscribe: () => void
  popular?: boolean
}) {
  return (
    <Card className={popular ? 'border-primary' : ''}>
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold mb-2">
          {price}
          {period && <span className="text-lg font-normal">/{period}</span>}
        </div>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={buttonVariant} onClick={onSubscribe}>
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}


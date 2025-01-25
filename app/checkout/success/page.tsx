import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-xl mb-8">Thank you for your purchase. Your premium features are now activated.</p>
      <Link href="/puzzles/kids">
        <Button>Start Solving Puzzles</Button>
      </Link>
    </div>
  )
}


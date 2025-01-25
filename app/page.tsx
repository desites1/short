import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to Word Search Puzzle</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <CategoryCard title="Kids" description="Fun and easy puzzles for children" href="/puzzles/kids?level=1" />
        <CategoryCard title="Teenagers" description="Challenging puzzles for young minds" href="/puzzles/teenagers?level=1" />
        <CategoryCard title="Adults" description="Complex puzzles for seasoned solvers" href="/puzzles/adults?level=1" />
      </div>
    </div>
  )
}

function CategoryCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="mb-4">{description}</p>
      <Link href={href}>
        <Button>Start Solving</Button>
      </Link>
    </div>
  )
}


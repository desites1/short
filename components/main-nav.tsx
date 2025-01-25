'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState, useCallback } from 'react'

export function MainNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Word Search Puzzle
        </Link>
        <button
          className="md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block`}>
          <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <li>
              <Link href="/">
                <Button variant="ghost">Home</Button>
              </Link>
            </li>
            <li>
              <Link href="/puzzles/kids?level=1">
                <Button variant="ghost">Kids</Button>
              </Link>
            </li>
            <li>
              <Link href="/puzzles/teenagers?level=1">
                <Button variant="ghost">Teenagers</Button>
              </Link>
            </li>
            <li>
              <Link href="/puzzles/adults?level=1">
                <Button variant="ghost">Adults</Button>
              </Link>
            </li>
            <li>
              <Link href="/pricing">
                <Button variant="ghost">Pricing</Button>
              </Link>
            </li>
            <li>
              <Link href="/account">
                <Button variant="ghost">Account</Button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}


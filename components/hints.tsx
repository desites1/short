'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface HintsProps {
  words: string[]
  foundWords: Set<string>
}

export function Hints({ words, foundWords }: HintsProps) {
  const [showHint, setShowHint] = useState(false)
  const [currentHint, setCurrentHint] = useState('')

  const getRandomUnfoundWord = () => {
    const unfoundWords = words.filter(word => !foundWords.has(word))
    if (unfoundWords.length === 0) return null
    
    const word = unfoundWords[Math.floor(Math.random() * unfoundWords.length)]
    return `Look for a ${word.length}-letter word starting with "${word[0]}"`
  }

  const handleShowHint = () => {
    const hint = getRandomUnfoundWord()
    if (hint) {
      setCurrentHint(hint)
      setShowHint(true)
    }
  }

  return (
    <div className="mt-4">
      <Button 
        onClick={handleShowHint}
        disabled={words.length === foundWords.size}
        className="mb-2"
      >
        Get Hint
      </Button>
      {showHint && (
        <Card className="p-4 bg-muted">
          <p>{currentHint}</p>
        </Card>
      )}
    </div>
  )
}


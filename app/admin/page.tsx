'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export default function AdminPage() {
  const [category, setCategory] = useState('kids')
  const [difficulty, setDifficulty] = useState('easy')
  const [words, setWords] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement API call to save new puzzle
    console.log('New puzzle:', { category, difficulty, words: words.split('\n') })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel - Add New Puzzle</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Category
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kids">Kids</SelectItem>
              <SelectItem value="teenagers">Teenagers</SelectItem>
              <SelectItem value="adults">Adults</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium mb-1">
            Difficulty
          </label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger id="difficulty">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="words" className="block text-sm font-medium mb-1">
            Words (one per line)
          </label>
          <Textarea
            id="words"
            value={words}
            onChange={(e) => setWords(e.target.value)}
            rows={5}
            placeholder="Enter words, one per line"
          />
        </div>
        <Button type="submit">Add Puzzle</Button>
      </form>
    </div>
  )
}


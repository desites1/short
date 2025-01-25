'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface Puzzle {
  id: string
  category: string
  difficulty: string
  words: string[]
}

export default function ManagePuzzles() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([])
  const [newPuzzle, setNewPuzzle] = useState({
    category: '',
    difficulty: '',
    words: '',
  })

  useEffect(() => {
    fetchPuzzles()
  }, [])

  const fetchPuzzles = async () => {
    try {
      const response = await fetch('/api/admin/puzzles')
      const data = await response.json()
      setPuzzles(data)
    } catch (error) {
      console.error('Failed to fetch puzzles:', error)
    }
  }

  const handleAddPuzzle = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/puzzles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newPuzzle,
          words: newPuzzle.words.split(',').map(word => word.trim()),
        }),
      })
      if (response.ok) {
        setNewPuzzle({ category: '', difficulty: '', words: '' })
        fetchPuzzles()
      }
    } catch (error) {
      console.error('Failed to add puzzle:', error)
    }
  }

  const handleDeletePuzzle = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/puzzles/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchPuzzles()
      }
    } catch (error) {
      console.error('Failed to delete puzzle:', error)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Puzzles</h2>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">Add New Puzzle</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Puzzle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddPuzzle} className="space-y-4">
            <Input
              placeholder="Category"
              value={newPuzzle.category}
              onChange={(e) => setNewPuzzle({ ...newPuzzle, category: e.target.value })}
              required
            />
            <Input
              placeholder="Difficulty"
              value={newPuzzle.difficulty}
              onChange={(e) => setNewPuzzle({ ...newPuzzle, difficulty: e.target.value })}
              required
            />
            <Input
              placeholder="Words (comma-separated)"
              value={newPuzzle.words}
              onChange={(e) => setNewPuzzle({ ...newPuzzle, words: e.target.value })}
              required
            />
            <Button type="submit">Add Puzzle</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Words</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {puzzles.map((puzzle) => (
            <TableRow key={puzzle.id}>
              <TableCell>{puzzle.id}</TableCell>
              <TableCell>{puzzle.category}</TableCell>
              <TableCell>{puzzle.difficulty}</TableCell>
              <TableCell>{puzzle.words.join(', ')}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => handleDeletePuzzle(puzzle.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


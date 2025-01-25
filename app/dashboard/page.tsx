'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface PuzzleProgress {
  category: string
  totalPuzzles: number
  completedPuzzles: number
}

export default function DashboardPage() {
  const [userProgress, setUserProgress] = useState<PuzzleProgress[]>([])

  useEffect(() => {
    // In a real application, fetch this data from your backend
    const mockProgress: PuzzleProgress[] = [
      { category: 'Kids', totalPuzzles: 100, completedPuzzles: 25 },
      { category: 'Teenagers', totalPuzzles: 100, completedPuzzles: 15 },
      { category: 'Adults', totalPuzzles: 100, completedPuzzles: 10 },
    ]
    setUserProgress(mockProgress)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Progress Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {userProgress.map((progress) => (
          <Card key={progress.category}>
            <CardHeader>
              <CardTitle>{progress.category} Puzzles</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={(progress.completedPuzzles / progress.totalPuzzles) * 100} />
              <p className="mt-2 text-sm text-gray-600">
                {progress.completedPuzzles} / {progress.totalPuzzles} completed
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


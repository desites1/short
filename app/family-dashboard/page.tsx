'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface FamilyMemberProgress {
  name: string
  progress: {
    category: string
    totalPuzzles: number
    completedPuzzles: number
  }[]
}

export default function FamilyDashboardPage() {
  const [familyProgress, setFamilyProgress] = useState<FamilyMemberProgress[]>([])

  useEffect(() => {
    // In a real application, fetch this data from your backend
    const mockFamilyProgress: FamilyMemberProgress[] = [
      {
        name: 'Parent',
        progress: [
          { category: 'Adults', totalPuzzles: 100, completedPuzzles: 50 },
        ],
      },
      {
        name: 'Child 1',
        progress: [
          { category: 'Kids', totalPuzzles: 100, completedPuzzles: 30 },
        ],
      },
      {
        name: 'Child 2',
        progress: [
          { category: 'Teenagers', totalPuzzles: 100, completedPuzzles: 20 },
        ],
      },
    ]
    setFamilyProgress(mockFamilyProgress)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Family Progress Dashboard</h1>
      <div className="space-y-6">
        {familyProgress.map((member) => (
          <Card key={member.name}>
            <CardHeader>
              <CardTitle>{member.name}&apos;s Progress</CardTitle>
            </CardHeader>
            <CardContent>
              {member.progress.map((progress) => (
                <div key={progress.category} className="mb-4">
                  <h3 className="text-lg font-semibold">{progress.category} Puzzles</h3>
                  <Progress value={(progress.completedPuzzles / progress.totalPuzzles) * 100} />
                  <p className="mt-2 text-sm text-gray-600">
                    {progress.completedPuzzles} / {progress.totalPuzzles} completed
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


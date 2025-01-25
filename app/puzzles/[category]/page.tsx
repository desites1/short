'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PuzzleGrid } from '@/components/puzzle-grid'
import { PuzzleControls } from '@/components/puzzle-controls'
import { AdPlacement } from '@/components/ad-placement'
import confetti from 'canvas-confetti'

export default function PuzzlePage({ params }: { params: { category: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [category, setCategory] = useState(params.category)
  const [difficulty, setDifficulty] = useState('easy')
  const [level, setLevel] = useState(parseInt(searchParams.get('level') || '1', 10))
  const [isPremium, setIsPremium] = useState(false) // This should be set based on user's actual premium status
  const [downloadCount, setDownloadCount] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(20 * 60) // 20 minutes in seconds
  const [wordsFound, setWordsFound] = useState(0)
  const [totalWords, setTotalWords] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(true)
  const [puzzleKey, setPuzzleKey] = useState(Date.now()) // Add this line

  const celebrateCompletion = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isTimerRunning && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            setIsTimerRunning(false)
            router.push('/time-up')
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isTimerRunning, timeRemaining, router])

  useEffect(() => {
    setIsTimerRunning(true)
    setPuzzleKey(Date.now()) // Add this line
  }, [category, difficulty, level])

  const resetPuzzle = useCallback(() => {
    setTimeRemaining(20 * 60)
    setWordsFound(0)
    setIsTimerRunning(true)
    setPuzzleKey(Date.now()) // Add this line
  }, [])

  useEffect(() => {
    setCategory(params.category)
    setLevel(parseInt(searchParams.get('level') || '1', 10))
    setDifficulty('easy') // Reset difficulty when category changes
    if (params.category !== category || searchParams.get('level') !== level.toString()) {
      resetPuzzle()
    }
  }, [params.category, searchParams, resetPuzzle, category, level])

  const handleUpdate = (newCategory: string, newDifficulty: string, newLevel: number) => {
    if (newCategory !== category || newDifficulty !== difficulty || newLevel !== level) {
      setCategory(newCategory)
      setDifficulty(newDifficulty)
      setLevel(newLevel)
      resetPuzzle()
      router.push(`/puzzles/${newCategory}?level=${newLevel}`)
    }
  }

  const handleDownload = () => {
    setDownloadCount((prevCount) => prevCount + 1)
  }

  const handleWordFound = useCallback((word: string) => {
    setWordsFound((prevCount) => {
      const newCount = prevCount + 1
      if (newCount === totalWords) {
        celebrateCompletion()
        setIsTimerRunning(false)
      }
      return newCount
    })
  }, [totalWords, celebrateCompletion])

  const handleTotalWordsUpdate = useCallback((total: number) => {
    setTotalWords(total)
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <h1 className="text-3xl font-bold mb-6">
        {category.charAt(0).toUpperCase() + category.slice(1)} Puzzles - Level {level}
      </h1>
      <div className="mb-4">
        <p>Time Remaining: {formatTime(timeRemaining)}</p>
        <p>Words Found: {wordsFound} / {totalWords}</p>
      </div>
      <AdPlacement id="top-banner" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        <div className="print-content overflow-x-auto w-full">
          <PuzzleGrid 
            key={puzzleKey}
            category={category} 
            difficulty={difficulty} 
            level={level} 
            onWordFound={handleWordFound}
            onTotalWordsUpdate={handleTotalWordsUpdate}
          />
        </div>
        <div className="lg:sticky lg:top-4 space-y-2 sm:space-y-4 w-full">
          <PuzzleControls
            category={category}
            difficulty={difficulty}
            level={level}
            onUpdate={handleUpdate}
            isPremium={isPremium}
            downloadCount={downloadCount}
            onDownload={handleDownload}
          />
          <AdPlacement id="sidebar" />
        </div>
      </div>
      <AdPlacement id="bottom-banner" />
    </div>
  )
}


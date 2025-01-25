'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface PuzzleGridProps {
  category: string
  difficulty: string
  level: number
  onWordFound: (word: string) => void
  onTotalWordsUpdate: (total: number) => void
}

export function PuzzleGrid({ category, difficulty, level, onWordFound, onTotalWordsUpdate }: PuzzleGridProps) {
  const [grid, setGrid] = useState<string[][]>([])
  const [words, setWords] = useState<string[]>([])
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set())
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set())
  const [highlightedCells, setHighlightedCells] = useState<Set<string>>(new Set())
  const [isSelecting, setIsSelecting] = useState(false)
  const [startCell, setStartCell] = useState<string | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const lastSelectedCell = useRef<string | null>(null)

  const fetchPuzzle = useCallback(async () => {
    try {
      const response = await fetch(`/api/puzzles?category=${category}&difficulty=${difficulty}&level=${level}`)
      const data = await response.json()
      setGrid(data.puzzle.grid)
      setWords(data.puzzle.words)
      setSelectedCells(new Set())
      setFoundWords(new Set())
      setHighlightedCells(new Set())
      onTotalWordsUpdate(data.puzzle.words.length)
    } catch (error) {
      console.error('Error fetching puzzle:', error)
    }
  }, [category, difficulty, level, onTotalWordsUpdate])

  useEffect(() => {
    fetchPuzzle()
  }, [fetchPuzzle])

  const handleMouseDown = useCallback((cellId: string) => {
    setIsSelecting(true)
    setStartCell(cellId)
    setSelectedCells(new Set([cellId]))
    lastSelectedCell.current = cellId
  }, [])

  const handleMouseEnter = useCallback((cellId: string) => {
    if (!isSelecting || !startCell || cellId === lastSelectedCell.current) return

    const [startRow, startCol] = startCell.split('-').map(Number)
    const [currentRow, currentCol] = cellId.split('-').map(Number)

    const rowDiff = currentRow - startRow
    const colDiff = currentCol - startCol
    const newSelectedCells = new Set<string>()

    if (Math.abs(rowDiff) === Math.abs(colDiff)) {
      const rowStep = Math.sign(rowDiff)
      const colStep = Math.sign(colDiff)
      for (let i = 0; i <= Math.abs(rowDiff); i++) {
        newSelectedCells.add(`${startRow + (i * rowStep)}-${startCol + (i * colStep)}`)
      }
    } else if (rowDiff === 0) {
      const step = Math.sign(colDiff)
      for (let col = startCol; step > 0 ? col <= currentCol : col >= currentCol; col += step) {
        newSelectedCells.add(`${startRow}-${col}`)
      }
    } else if (colDiff === 0) {
      const step = Math.sign(rowDiff)
      for (let row = startRow; step > 0 ? row <= currentRow : row >= currentRow; row += step) {
        newSelectedCells.add(`${row}-${startCol}`)
      }
    }

    setSelectedCells(newSelectedCells)
    lastSelectedCell.current = cellId
  }, [isSelecting, startCell])

  const handleMouseUp = useCallback(() => {
    if (!isSelecting) return

    const selectedWord = Array.from(selectedCells)
      .sort()
      .map(cellId => {
        const [row, col] = cellId.split('-').map(Number)
        return grid[row]?.[col] || ''
      })
      .join('')

    const reverseWord = selectedWord.split('').reverse().join('')

    if ((words.includes(selectedWord) || words.includes(reverseWord)) && 
      !foundWords.has(selectedWord) && !foundWords.has(reverseWord)) {
      const wordToAdd = words.includes(selectedWord) ? selectedWord : reverseWord
      setFoundWords(prev => {
        const newFoundWords = new Set(prev)
        newFoundWords.add(wordToAdd)
        return newFoundWords
      })
      setHighlightedCells(prev => new Set([...prev, ...selectedCells]))
      onWordFound(wordToAdd)
    }

    setSelectedCells(new Set())
    setIsSelecting(false)
    setStartCell(null)
    lastSelectedCell.current = null
  }, [isSelecting, selectedCells, grid, words, foundWords, onWordFound])

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isSelecting) {
        handleMouseUp()
      }
    }

    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [isSelecting, handleMouseUp])

  const getCellSize = () => {
    switch (difficulty) {
      case 'easy': return 'w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 print:w-14 print:h-14'
      case 'medium': return 'w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9 lg:w-11 lg:h-11 print:w-12 print:h-12'
      case 'hard': return 'w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 print:w-11 print:h-11'
      default: return 'w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 print:w-14 print:h-14'
    }
  }

  const getFontSize = () => {
    switch (difficulty) {
      case 'easy': return 'text-[8px] sm:text-xs md:text-sm lg:text-base print:text-xl'
      case 'medium': return 'text-[6px] sm:text-[10px] md:text-xs lg:text-sm print:text-lg'
      case 'hard': return 'text-[4px] sm:text-[8px] md:text-[10px] lg:text-xs print:text-base'
      default: return 'text-[8px] sm:text-xs md:text-sm lg:text-base print:text-xl'
    }
  }

  const preventScroll = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
  }, [])

  useEffect(() => {
    const gridElement = gridRef.current
    if (gridElement) {
      gridElement.addEventListener('touchmove', preventScroll as any, { passive: false })
    }
    return () => {
      if (gridElement) {
        gridElement.removeEventListener('touchmove', preventScroll as any)
      }
    }
  }, [preventScroll])

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-lg p-2 sm:p-4 md:p-6 print:shadow-none print:p-0 overflow-x-auto">
      <div className="grid grid-cols-1 gap-8 print:block">
        <div className="print:mb-8 text-center">
          <h3 className="text-lg font-semibold mb-4">Words to Find:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 max-w-2xl mx-auto text-xs sm:text-sm md:text-base">
            {words.map((word) => (
              <div
                key={word}
                className={`${
                  foundWords.has(word) ? 'line-through text-green-500 print:text-gray-500' : ''
                } text-center`}
              >
                {word}
              </div>
            ))}
          </div>
        </div>
        
        <div
          ref={gridRef}
          className="grid gap-0 mx-auto overflow-hidden touch-none puzzle-grid"
          style={{
            gridTemplateColumns: `repeat(${grid[0]?.length || 0}, minmax(0, 1fr))`,
            maxWidth: '100%',
            width: 'fit-content',
            aspectRatio: '1 / 1',
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const cellId = `${rowIndex}-${colIndex}`
              const isHighlighted = highlightedCells.has(cellId)
              const isSelected = selectedCells.has(cellId)
              return (
                <div
                  key={cellId}
                  className={`
                    ${getCellSize()}
                    ${getFontSize()}
                    flex items-center justify-center
                    font-bold
                    cursor-pointer
                    select-none
                    ${isHighlighted ? 'bg-green-500 text-white' : 
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-background'}
                    border border-border
                    print:border-gray-300 print:bg-white print:text-black
                    ${isHighlighted ? 'print:bg-white print:text-black' : ''}
                  `}
                  onMouseDown={() => handleMouseDown(cellId)}
                  onMouseEnter={() => handleMouseEnter(cellId)}
                  onTouchStart={(e) => {
                    e.preventDefault()
                    handleMouseDown(cellId)
                  }}
                  onTouchMove={(e) => {
                    e.preventDefault()
                    const touch = e.touches[0]
                    const element = document.elementFromPoint(touch.clientX, touch.clientY)
                    const touchedCellId = element?.getAttribute('data-cell-id')
                    if (touchedCellId) {
                      handleMouseEnter(touchedCellId)
                    }
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault()
                    handleMouseUp()
                  }}
                  data-cell-id={cellId}
                >
                  {cell}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}


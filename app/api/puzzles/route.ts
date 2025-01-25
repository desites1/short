import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') || 'kids'
  const difficulty = searchParams.get('difficulty') || 'easy'
  const level = parseInt(searchParams.get('level') || '1', 10)

  const puzzle = generatePuzzle(category, difficulty, level)

  return NextResponse.json({ puzzle })
}

function generatePuzzle(category: string, difficulty: string, level: number) {
  const words = getWordsForCategory(category, level)
  const gridSize = getDifficultyGridSize(difficulty)
  const grid = createEmptyGrid(gridSize)

  // Place words in the grid
  words.forEach(word => placeWord(grid, word))

  // Fill remaining spaces with random letters
  fillEmptySpaces(grid)

  return {
    grid,
    words,
    category,
    difficulty,
    level
  }
}

function getWordsForCategory(category: string, level: number): string[] {
  const baseWords = {
    kids: [
      'CAT', 'DOG', 'BALL', 'TREE', 'SUN', 'BIRD', 'FISH', 'BOOK', 'STAR', 'MOON',
      'HAT', 'CAKE', 'FROG', 'KITE', 'SHIP', 'BEAR', 'DUCK', 'LION', 'APPLE', 'HOUSE'
    ],
    teenagers: [
      'SCHOOL', 'FRIEND', 'MUSIC', 'PHONE', 'GAME', 'SPORT', 'MOVIE', 'DANCE', 'PARTY', 'STYLE',
      'SOCIAL', 'HOBBY', 'STUDY', 'TREND', 'PIZZA', 'BEACH', 'SELFIE', 'CRUSH', 'DRAMA', 'SQUAD'
    ],
    adults: [
      'CAREER', 'FINANCE', 'HEALTH', 'TRAVEL', 'FAMILY', 'INVEST', 'GARDEN', 'RECIPE', 'HOBBY', 'LEARN',
      'BUDGET', 'EXERCISE', 'CULTURE', 'POLITICS', 'SCIENCE', 'HISTORY', 'COOKING', 'READING', 'NATURE', 'TECHNOLOGY'
    ]
  }

  const words = baseWords[category as keyof typeof baseWords] || []
  const shuffled = words.sort(() => 0.5 - Math.random())
  const numWords = Math.min(10 + Math.floor(level / 10), 20)
  return shuffled.slice(0, numWords)
}

function getDifficultyGridSize(difficulty: string): number {
  switch (difficulty) {
    case 'easy': return 10
    case 'medium': return 15
    case 'hard': return 20
    default: return 12
  }
}

function createEmptyGrid(size: number): string[][] {
  return Array(size).fill(null).map(() => Array(size).fill(''))
}

function placeWord(grid: string[][], word: string) {
  const directions = [
    [0, 1],   // right
    [1, 0],   // down
    [1, 1],   // diagonal down-right
    [-1, 1],  // diagonal up-right
  ]

  let placed = false
  while (!placed) {
    const direction = directions[Math.floor(Math.random() * directions.length)]
    const row = Math.floor(Math.random() * grid.length)
    const col = Math.floor(Math.random() * grid[0].length)

    if (canPlaceWord(grid, word, row, col, direction)) {
      placeWordAt(grid, word, row, col, direction)
      placed = true
    }
  }
}

function canPlaceWord(grid: string[][], word: string, row: number, col: number, [dx, dy]: number[]): boolean {
  if (row + dx * (word.length - 1) < 0 || row + dx * (word.length - 1) >= grid.length) return false
  if (col + dy * (word.length - 1) < 0 || col + dy * (word.length - 1) >= grid[0].length) return false

  for (let i = 0; i < word.length; i++) {
    const currentRow = row + dx * i
    const currentCol = col + dy * i
    if (grid[currentRow][currentCol] !== '' && grid[currentRow][currentCol] !== word[i]) {
      return false
    }
  }

  return true
}

function placeWordAt(grid: string[][], word: string, row: number, col: number, [dx, dy]: number[]) {
  for (let i = 0; i < word.length; i++) {
    grid[row + dx * i][col + dy * i] = word[i]
  }
}

function fillEmptySpaces(grid: string[][]) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === '') {
        grid[i][j] = letters[Math.floor(Math.random() * letters.length)]
      }
    }
  }
}


import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

// Mock database
let puzzles: any[] = []

export async function GET() {
  return NextResponse.json(puzzles)
}

export async function POST(request: Request) {
  const puzzle = await request.json()
  const newPuzzle = {
    id: uuidv4(),
    ...puzzle,
  }
  puzzles.push(newPuzzle)
  return NextResponse.json(newPuzzle)
}


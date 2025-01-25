import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  puzzles = puzzles.filter(puzzle => puzzle.id !== id)
  return NextResponse.json({ success: true })
}


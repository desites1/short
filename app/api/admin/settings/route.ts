import { NextResponse } from 'next/server'

// Mock database
let siteSettings = {
  siteTitle: 'Word Search Puzzle',
  contactEmail: 'admin@wordsearchpuzzle.com',
}

export async function POST(request: Request) {
  const newSettings = await request.json()
  siteSettings = { ...siteSettings, ...newSettings }
  return NextResponse.json({ success: true, settings: siteSettings })
}


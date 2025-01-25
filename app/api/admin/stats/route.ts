import { NextResponse } from 'next/server'

// In a real application, you would fetch this data from your database
const mockStats = {
  totalPuzzles: 500,
  totalUsers: 10000,
  premiumUsers: 1000,
  puzzlesPlayed: 50000,
}

export async function GET() {
  // Here you would typically check for admin authentication
  // For simplicity, we're skipping that step in this example

  return NextResponse.json(mockStats)
}


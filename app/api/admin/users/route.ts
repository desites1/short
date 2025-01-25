import { NextResponse } from 'next/server'

// Mock database
let users: any[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', isPremium: false },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', isPremium: true },
]

export async function GET() {
  return NextResponse.json(users)
}


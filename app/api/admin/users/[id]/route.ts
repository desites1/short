import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  const { isPremium } = await request.json()
  
  users = users.map(user => 
    user.id === id ? { ...user, isPremium } : user
  )

  return NextResponse.json({ success: true })
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  users = users.filter(user => user.id !== id)
  return NextResponse.json({ success: true })
}


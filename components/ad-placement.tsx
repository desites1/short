'use client'

import { useContext } from 'react'
import { UserContext } from '@/lib/user-context'

export function AdPlacement({ id }: { id: string }) {
  const { user } = useContext(UserContext)

  if (user?.premiumStatus) {
    return null
  }

  return (
    <div className="bg-muted p-4 text-center mb-4 mt-5" style={{ minHeight: '100px' }}>
      Ad Placement: {id}
    </div>
  )
}


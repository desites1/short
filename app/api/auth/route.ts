import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { sendVerificationEmail } from '@/lib/email'

// This is a mock user database. In a real application, you would use a proper database.
const users = new Map()
const verificationTokens = new Map()

export async function POST(request: Request) {
  const { action, email, password, name } = await request.json()

  if (action === 'signup') {
    if (users.has(email)) {
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 })
    }
    const verificationToken = uuidv4()
    verificationTokens.set(verificationToken, { email, password, name })
    await sendVerificationEmail(email, verificationToken)
    return NextResponse.json({ success: true, message: 'Verification email sent. Please check your inbox.' })
  } else if (action === 'verify') {
    const { token } = await request.json()
    const userData = verificationTokens.get(token)
    if (userData) {
      const { email, password, name } = userData
      users.set(email, { email, password, name, isVerified: true, premiumStatus: false, parentalControls: {} })
      verificationTokens.delete(token)
      return NextResponse.json({ success: true, message: 'Email verified successfully' })
    } else {
      return NextResponse.json({ success: false, message: 'Invalid or expired verification token' }, { status: 400 })
    }
  } else if (action === 'login') {
    const user = users.get(email)
    if (user && user.password === password && user.isVerified) {
      const { password, ...userProfile } = user
      return NextResponse.json({ success: true, message: 'Login successful', user: userProfile })
    } else if (user && !user.isVerified) {
      return NextResponse.json({ success: false, message: 'Please verify your email before logging in' }, { status: 401 })
    } else {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
    }
  } else if (action === 'add_family_member') {
    const { parentEmail, memberEmail, memberName } = await request.json()
    const parentUser = users.get(parentEmail)
    
    if (!parentUser || parentUser.subscriptionPlan !== 'family') {
      return NextResponse.json({
        success: false,
        message: 'Only family plan subscribers can add family members'
      }, { status: 400 })
    }

    if (parentUser.familyMembers && parentUser.familyMembers.length >= 4) {
      return NextResponse.json({
        success: false,
        message: 'Family plan limit reached (maximum 5 accounts including parent)'
      }, { status: 400 })
    }

    const verificationToken = uuidv4()
    verificationTokens.set(verificationToken, { email: memberEmail, password: '', name: memberName, parentEmail })
    await sendVerificationEmail(memberEmail, verificationToken)

    if (!parentUser.familyMembers) {
      parentUser.familyMembers = []
    }
    parentUser.familyMembers.push(memberEmail)

    return NextResponse.json({
      success: true,
      message: 'Verification email sent to family member. Please ask them to verify their email.'
    })
  } else {
    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 })
  }
}


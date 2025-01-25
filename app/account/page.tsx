'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface UserProfile {
  email: string;
  name: string;
  about: string;
  subscriptionPlan: 'free' | 'premium' | 'family';
  downloadLimit: number;
  downloadsRemaining: number;
  subscriptionExpiry: string;
  autoRenewal: boolean;
  parentalControls?: {
    maxDifficulty: 'easy' | 'medium' | 'hard';
    maxPuzzlesPerDay: number;
  };
}

export default function AccountPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [message, setMessage] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const verificationToken = searchParams.get('token')

  useEffect(() => {
    // Check if user is already logged in
    const storedProfile = localStorage.getItem('userProfile')
    if (storedProfile) {
      setIsLoggedIn(true)
      setUserProfile(JSON.parse(storedProfile))
    }
  }, [])

  useEffect(() => {
    if (verificationToken) {
      handleVerification(verificationToken)
    }
  }, [verificationToken])

  const handleVerification = async (token: string) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'verify', token }),
      })
      const data = await response.json()
      if (data.success) {
        setMessage('Email verified successfully. You can now log in.')
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      setMessage('An error occurred during verification. Please try again.')
    }
  }

  const handleAuth = async (e: React.FormEvent, action: 'login' | 'signup') => {
    e.preventDefault()
    setMessage('')

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, email, password, name }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage(data.message)
        if (action === 'login') {
          setIsLoggedIn(true)
          const newProfile: UserProfile = {
            ...data.user,
            subscriptionPlan: data.user.premiumStatus ? 'premium' : 'free',
            downloadLimit: data.user.premiumStatus ? 25 : 10,
            downloadsRemaining: data.user.premiumStatus ? 25 : 10,
            subscriptionExpiry: data.user.subscriptionExpiry || 'N/A',
            autoRenewal: data.user.autoRenewal || false,
          }
          setUserProfile(newProfile)
          localStorage.setItem('userProfile', JSON.stringify(newProfile))
          router.push('/')
        }
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserProfile(null)
    localStorage.removeItem('userProfile')
    router.push('/')
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (userProfile) {
      const updatedProfile = { ...userProfile, name, about }
      setUserProfile(updatedProfile)
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile))
      setMessage('Profile updated successfully')
    }
  }

  const handleAutoRenewalToggle = () => {
    if (userProfile) {
      const updatedProfile = { ...userProfile, autoRenewal: !userProfile.autoRenewal }
      setUserProfile(updatedProfile)
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile))
      setMessage('Auto-renewal setting updated')
    }
  }

  if (isLoggedIn && userProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <Input
                    type="text"
                    id="name"
                    value={name || userProfile.name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <Input
                    type="email"
                    id="email"
                    value={userProfile.email}
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700">About</label>
                  <Textarea
                    id="about"
                    value={about || userProfile.about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="mt-1"
                    rows={4}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Subscription Plan</p>
                  <p className="mt-1">{userProfile.subscriptionPlan.charAt(0).toUpperCase() + userProfile.subscriptionPlan.slice(1)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Download Limit</p>
                  <p className="mt-1">{userProfile.downloadsRemaining} / {userProfile.downloadLimit} remaining today</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Subscription Expiry</p>
                  <p className="mt-1">{userProfile.subscriptionExpiry}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-renewal"
                    checked={userProfile.autoRenewal}
                    onCheckedChange={handleAutoRenewalToggle}
                  />
                  <Label htmlFor="auto-renewal">Auto-renewal</Label>
                </div>
                {userProfile?.subscriptionPlan === 'family' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Parental Controls</h3>
                    <div className="space-y-2">
                      <div>
                        <label htmlFor="maxDifficulty" className="block text-sm font-medium text-gray-700">Maximum Difficulty</label>
                        <select
                          id="maxDifficulty"
                          value={userProfile.parentalControls?.maxDifficulty || 'hard'}
                          onChange={(e) => {
                            const newProfile = {
                              ...userProfile,
                              parentalControls: {
                                ...userProfile.parentalControls,
                                maxDifficulty: e.target.value,
                              },
                            }
                            setUserProfile(newProfile)
                            localStorage.setItem('userProfile', JSON.stringify(newProfile))
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="maxPuzzlesPerDay" className="block text-sm font-medium text-gray-700">Maximum Puzzles Per Day</label>
                        <input
                          type="number"
                          id="maxPuzzlesPerDay"
                          value={userProfile.parentalControls?.maxPuzzlesPerDay || 10}
                          onChange={(e) => {
                            const newProfile = {
                              ...userProfile,
                              parentalControls: {
                                ...userProfile.parentalControls,
                                maxPuzzlesPerDay: parseInt(e.target.value),
                              },
                            }
                            setUserProfile(newProfile)
                            localStorage.setItem('userProfile', JSON.stringify(newProfile))
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Button type="submit" className="mt-4">Update Profile</Button>
            </form>
          </CardContent>
          <CardFooter>
            <Button onClick={handleLogout} variant="outline">Logout</Button>
          </CardFooter>
        </Card>
        {message && (
          <p className="mt-4 text-center text-sm font-medium text-green-600">{message}</p>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Login or create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Signup</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={(e) => handleAuth(e, 'login')}>
                <div className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full">Login</Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={(e) => handleAuth(e, 'signup')}>
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full">Sign Up</Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      {message && (
        <p className="mt-4 text-center text-sm font-medium text-red-600">{message}</p>
      )}
    </div>
  )
}


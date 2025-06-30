'use client'

import { createContext, useContext, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name?: string
  avatar?: string
}

interface UserContextType {
  user: User | null
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  // 暂时使用模拟用户数据
  const mockUser: User = {
    id: 'user-1',
    email: 'demo@example.com',
    name: 'Demo User',
  }

  const value: UserContextType = {
    user: mockUser,
    isLoading: false,
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

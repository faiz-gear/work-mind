'use client'

import { ChakraProvider as BaseChakraProvider } from '@chakra-ui/react'
import { theme } from '@/styles/theme'

export function ChakraProvider({ children }: { children: React.ReactNode }) {
  return <BaseChakraProvider theme={theme}>{children}</BaseChakraProvider>
}

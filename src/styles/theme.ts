import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true,
  },
  // Unified sm size configuration across all components
  components: {
    Button: {
      defaultProps: {
        size: 'sm',
      },
    },
    Input: {
      defaultProps: {
        size: 'sm',
      },
    },
    Select: {
      defaultProps: {
        size: 'sm',
      },
    },
    Textarea: {
      defaultProps: {
        size: 'sm',
      },
    },
    Checkbox: {
      defaultProps: {
        size: 'sm',
      },
    },
    Radio: {
      defaultProps: {
        size: 'sm',
      },
    },
    Switch: {
      defaultProps: {
        size: 'sm',
      },
    },
    FormControl: {
      defaultProps: {
        size: 'sm',
      },
    },
  },
  // Base font size and spacing adjustments for sm theme
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem', // 14px - unified sm size
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
  },
  space: {
    0: '0',
    1: '0.25rem', // 4px
    2: '0.5rem', // 8px
    3: '0.75rem', // 12px - sm spacing
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    8: '2rem', // 32px
  },
})

export { theme }

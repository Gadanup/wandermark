import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: '#FAF7F2',
          paper: '#FFFFFF',
        },
        text: {
          primary: '#1A1208',
          secondary: '#5C4A2A',
        },
        primary: {
          main: '#C4692A',
          light: '#D4834A',
          dark: '#A0521E',
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: '#5C4A2A',
          light: '#7A6340',
          dark: '#3D3019',
          contrastText: '#FFFFFF',
        },
        divider: '#E8DECE',
      },
    },
    dark: {
      palette: {
        background: {
          default: '#120F0A',
          paper: '#1E1810',
        },
        text: {
          primary: '#F5ECD7',
          secondary: '#C4A87A',
        },
        primary: {
          main: '#D4834A',
          light: '#E09A68',
          dark: '#C4692A',
          contrastText: '#120F0A',
        },
        secondary: {
          main: '#C4A87A',
          light: '#D4BC96',
          dark: '#A08A5A',
          contrastText: '#120F0A',
        },
        divider: '#2E2416',
      },
    },
  },
  typography: {
    fontFamily: '"DM Sans", system-ui, sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 400,
    },
    h6: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 400,
    },
    body1: {
      fontFamily: '"DM Sans", system-ui, sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"DM Sans", system-ui, sans-serif',
      fontWeight: 400,
    },
    button: {
      fontFamily: '"DM Sans", system-ui, sans-serif',
      fontWeight: 500,
      textTransform: 'none',
    },
    caption: {
      fontFamily: '"DM Sans", system-ui, sans-serif',
    },
    overline: {
      fontFamily: '"DM Sans", system-ui, sans-serif',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
})

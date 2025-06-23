import { createTheme } from '@mui/material/styles';

// Color Palette
export const colors = {
  primary: {
    main: '#2E7D32',      // ירוק עמוק
    light: '#4CAF50',     // ירוק בהיר
    dark: '#1B5E20',      // ירוק כהה
    contrastText: '#FFFFFF'
  },
  secondary: {
    main: '#FF6B35',      // כתום
    light: '#FF8A65',     // כתום בהיר
    dark: '#E64A19',      // כתום כהה
    contrastText: '#FFFFFF'
  },
  background: {
    default: '#F8F9FA',   // רקע בהיר
    paper: '#FFFFFF',     // רקע כרטיסים
    accent: '#E8F5E8',    // רקע אקסנט ירוק בהיר
  },
  text: {
    primary: '#212121',   // טקסט ראשי
    secondary: '#757575', // טקסט משני
    disabled: '#BDBDBD',  // טקסט מבוטל
  },
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
  },
  warning: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
  },
  error: {
    main: '#F44336',
    light: '#EF5350',
    dark: '#D32F2F',
  },
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  }
};

// Create MUI Theme
export const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    text: colors.text,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    grey: colors.grey,
  },
  typography: {
    fontFamily: '"Roboto", "Heebo", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: colors.text.primary,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: colors.text.primary,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: colors.text.primary,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: colors.text.primary,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: colors.text.primary,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      color: colors.text.primary,
    },
    body1: {
      fontSize: '1rem',
      color: colors.text.primary,
    },
    body2: {
      fontSize: '0.875rem',
      color: colors.text.secondary,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 24px',
        },
        contained: {
          boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(46, 125, 50, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});
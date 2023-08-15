import { createTheme, responsiveFontSizes } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#388e3c',
    },
    secondary: {
      main: '#1976d2',
    },
    success: {
      main: '#2e7d32',
    },
    error: {
      main: '#ffffff',
    },
  },

  typography: {
    body1: {
      fontSize: '1.2rem',
    },
  },

  components: {
    MuiStack:{
      styleOverrides:{
        root:{
          // border: '1px white solid',
          spacing: 0,
          justifyContent: 'center',
          alignItems: 'center',
          // height: '100%',
        }
      }
    },
    MuiTypography:{
      styleOverrides:{
        root:{
          whiteSpace: 'pre-wrap',
        },
        body1:{
          fontStyle:'italic',
        }
      }
    },
    
  }



})

export default responsiveFontSizes(theme);
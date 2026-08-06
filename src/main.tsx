import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

const theme = createTheme({
  palette: { primary: { main: '#2457d6' }, background: { default: '#f7f8fc' } },
  shape: { borderRadius: 10 },
  typography: { fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', h4: { letterSpacing: '-0.03em' } },
  components: { MuiPaper: { styleOverrides: { root: { backgroundImage: 'none', border: '1px solid #e8eaf0', boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)' } } }, MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { textTransform: 'none', fontWeight: 700 } } } },
})

createRoot(document.getElementById('root')!).render(<StrictMode><ThemeProvider theme={theme}><CssBaseline /><BrowserRouter><App /></BrowserRouter></ThemeProvider></StrictMode>)


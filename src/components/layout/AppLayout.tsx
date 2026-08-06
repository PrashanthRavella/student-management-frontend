import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const drawerWidth = 248
const navigation = [
  { label: 'Dashboard', path: '/', icon: <DashboardOutlinedIcon /> },
  { label: 'Students', path: '/students', icon: <SchoolOutlinedIcon /> },
]

function Navigation() {
  return (
    <Box>
      <Toolbar sx={{ gap: 1.5 }}>
        <SchoolOutlinedIcon color="primary" />
        <Typography variant="subtitle1" fontWeight={800}>Prashanth Portal</Typography>
      </Toolbar>
      <List sx={{ px: 1.5 }}>
        {navigation.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            end={item.path === '/'}
            sx={{ borderRadius: 2, mb: 0.5, '&.active': { bgcolor: 'primary.50', color: 'primary.main' } }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  )
}

export function AppLayout() {
  const theme = useTheme()
  const desktop = useMediaQuery(theme.breakpoints.up('md'))
  const [open, setOpen] = useState(false)
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <AppBar position="fixed" elevation={0} sx={{ ml: { md: `${drawerWidth}px` }, width: { md: `calc(100% - ${drawerWidth}px)` }, bgcolor: 'background.paper', color: 'text.primary', borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          {!desktop && <IconButton aria-label="Open navigation" onClick={() => setOpen(true)} sx={{ mr: 1 }}><MenuIcon /></IconButton>}
          <Typography variant="h6" component="span" fontWeight={700}>Student Management Portal</Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant={desktop ? 'permanent' : 'temporary'} open={desktop || open} onClose={() => setOpen(false)} ModalProps={{ keepMounted: true }} sx={{ '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}>
        <Navigation />
      </Drawer>
      <Box component="main" sx={{ ml: { md: `${drawerWidth}px` }, pt: 10, pb: 5 }}>
        <Container maxWidth="xl"><Outlet /></Container>
      </Box>
    </Box>
  )
}


import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import LogoutIcon from '@mui/icons-material/Logout'
import HistoryIcon from '@mui/icons-material/History'
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
  Button,
  Chip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

const drawerWidth = 248
function Navigation() {
  const { user } = useAuth()
  const navigation = [
    { label: 'Dashboard', path: '/', icon: <DashboardOutlinedIcon />, show: true },
    { label: user?.role === 'Student' ? 'My profile' : user?.role === 'Parent' ? 'My children' : 'Students', path: '/students', icon: <SchoolOutlinedIcon />, show: true },
    { label: 'Courses & grades', path: '/courses', icon: <MenuBookOutlinedIcon />, show: true },
    { label: 'User accounts', path: '/users', icon: <PeopleOutlineIcon />, show: user?.role === 'Admin' },
    { label: 'Security activity', path: '/activity', icon: <HistoryIcon />, show: user?.role === 'Admin' },
  ]
  return (
    <Box>
      <Toolbar sx={{ gap: 1.5 }}>
        <SchoolOutlinedIcon color="primary" />
        <Typography variant="subtitle1" fontWeight={800}>Prashanth Portal</Typography>
      </Toolbar>
      <List sx={{ px: 1.5 }}>
        {navigation.filter((item) => item.show).map((item) => (
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
  const { user, signOut } = useAuth()
  const theme = useTheme()
  const desktop = useMediaQuery(theme.breakpoints.up('md'))
  const [open, setOpen] = useState(false)
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <AppBar position="fixed" elevation={0} sx={{ ml: { md: `${drawerWidth}px` }, width: { md: `calc(100% - ${drawerWidth}px)` }, bgcolor: 'background.paper', color: 'text.primary', borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          {!desktop && <IconButton aria-label="Open navigation" onClick={() => setOpen(true)} sx={{ mr: 1 }}><MenuIcon /></IconButton>}
          <Typography variant="h6" component="span" fontWeight={700} sx={{ flexGrow: 1 }}>Student Management Portal</Typography>
          <Chip label={user?.role} color="primary" variant="outlined" size="small" sx={{ mr: 1 }} />
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={() => void signOut()}>Logout</Button>
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

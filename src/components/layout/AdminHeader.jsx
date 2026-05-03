import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Article as ArticleIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Add as AddIcon,
  Home as HomeIcon, // Import HomeIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminHeader = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null); // For desktop profile menu
  const [drawerOpen, setDrawerOpen] = useState(false); // For mobile drawer

  const handleNavigation = (path) => {
    navigate(path);
    setAnchorEl(null);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    setDrawerOpen(false);
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: 'primary.dark', // A distinct color for admin header
        color: 'primary.contrastText',
        zIndex: theme.zIndex.drawer + 1,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ flexGrow: 1 }}
        >
          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(true)} color="inherit">
              <MenuIcon />
            </IconButton>
          )}

          <Box
            onClick={() => handleNavigation('/admin/articles')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              gap: theme.spacing(1),
            }}
          >
            <DashboardIcon sx={{ fontSize: theme.spacing(4) }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}
            >
              Admin Dashboard
            </Typography>
          </Box>

          {!isMobile && (
            <>
              <Button
                onClick={() => handleNavigation('/admin/articles')}
                sx={{
                  color: 'inherit',
                  textTransform: 'none',
                  fontWeight: 'medium',
                  fontSize: '1rem',
                  borderRadius: theme.shape.borderRadius,
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                Manage Articles
              </Button>
              <Button
                onClick={() => handleNavigation('/admin/articles/new')}
                startIcon={<AddIcon />}
                sx={{
                  color: 'inherit',
                  textTransform: 'none',
                  fontWeight: 'medium',
                  fontSize: '1rem',
                  borderRadius: theme.shape.borderRadius,
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                Create Article
              </Button>
              <Button
                onClick={() => handleNavigation('/admin/profile')}
                sx={{
                  color: 'inherit',
                  textTransform: 'none',
                  fontWeight: 'medium',
                  fontSize: '1rem',
                  borderRadius: theme.shape.borderRadius,
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                My Author Profile
              </Button>
              {/* New "Go to App" button for desktop */}
              <Button
                onClick={() => handleNavigation('/')}
                startIcon={<HomeIcon />}
                sx={{
                  color: 'inherit',
                  textTransform: 'none',
                  fontWeight: 'medium',
                  fontSize: '1rem',
                  borderRadius: theme.shape.borderRadius,
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                Go to App
              </Button>
            </>
          )}
        </Stack>

        {/* Desktop Logout/Profile Menu */}
        {!isMobile && user && (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="body2" color="inherit">
              Welcome, {user.displayName || user.email}!
            </Typography>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderColor: 'primary.light',
                '&:hover': {
                  borderColor: 'inherit',
                  bgcolor: 'action.hover',
                },
              }}
            >
              Logout
            </Button>
          </Stack>
        )}

        {/* Mobile Drawer */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{ elevation: 0, sx: { width: theme.spacing(35) } }}
        >
          <Box
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <Box
              sx={{
                p: theme.spacing(3),
                bgcolor: 'primary.dark',
                color: 'primary.contrastText',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'black' }}>
                Admin Menu
              </Typography>
            </Box>

            <List sx={{ p: theme.spacing(1.5) }}>
              <ListItemButton
                onClick={() => handleNavigation('/admin/articles')}
                selected={location.pathname === '/admin/articles'}
                sx={{ borderRadius: theme.shape.borderRadius, mb: 0.5 }}
              >
                <ListItemIcon>
                  <ArticleIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Manage Articles" />
              </ListItemButton>

              <ListItemButton
                onClick={() => handleNavigation('/admin/articles/new')}
                selected={location.pathname === '/admin/articles/new'}
                sx={{ borderRadius: theme.shape.borderRadius, mb: 0.5 }}
              >
                <ListItemIcon>
                  <AddIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Create Article" />
              </ListItemButton>

              <ListItemButton
                onClick={() => handleNavigation('/admin/profile')}
                selected={location.pathname === '/admin/profile'}
                sx={{ borderRadius: theme.shape.borderRadius, mb: 0.5 }}
              >
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Author Profile" />
              </ListItemButton>

              <Divider sx={{ my: theme.spacing(1) }} />

              {/* New "Go to App" button for mobile drawer */}
              <ListItemButton
                onClick={() => handleNavigation('/')}
                sx={{ borderRadius: theme.shape.borderRadius, mb: 0.5 }}
              >
                <ListItemIcon>
                  <HomeIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Go to App" />
              </ListItemButton>

              <Divider sx={{ my: theme.spacing(1) }} />

              {user && (
                <ListItemButton
                  onClick={handleLogout}
                  sx={{
                    color: 'primary.main',
                    borderRadius: theme.shape.borderRadius,
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              )}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;

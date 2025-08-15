'use client';

import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import {
  AccountCircle,
  ExitToApp,
  People,
  SportsEsports,
  Settings,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { AuthService, AuthUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
    } else {
      setUser(currentUser);
    }
  }, [router]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    AuthService.logout();
    router.push('/login');
  };

  if (!user) {
    return null; // Loading or redirecting
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            WSOB Poker Management
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Welcome, {user.player_name}
            </Typography>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {user.player_name.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <People sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6">Players</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Manage player profiles and information
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={() => router.push('/players')}
                  sx={{ mt: 2 }}
                >
                  View Players
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SportsEsports sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6">Games</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  View and manage poker games
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={() => router.push('/games')}
                  sx={{ mt: 2 }}
                >
                  View Games
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {user.is_admin && (
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Settings sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6">Admin</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Administrative functions and settings
                  </Typography>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={() => router.push('/admin')}
                    sx={{ mt: 2 }}
                  >
                    Admin Panel
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Quick Stats
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    31
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Players
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    6
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Games Played
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    2
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Rules
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
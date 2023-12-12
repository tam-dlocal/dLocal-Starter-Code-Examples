import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

const Header = ({ onMenuToggle }) => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={onMenuToggle}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">Smart Checkout</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

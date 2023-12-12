import React from 'react';
import { Box } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        bgcolor: 'primary.main',
        color: 'white',
        p: 2,
        textAlign: 'center',
      }}
    >
      Smart Checkout - All rights reserved
    </Box>
  );
};

export default Footer;

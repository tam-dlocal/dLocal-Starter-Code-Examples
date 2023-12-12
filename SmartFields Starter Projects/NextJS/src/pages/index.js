import React from 'react';
import { Box, Typography } from '@mui/material';
import Layout from '../components/layout/Layout';
import Link from 'next/link';

const Home = () => {
  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography variant="h1">Welcome to Smart Checkout</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
        <Link href="/checkout">

          <Typography variant="h5">Checkout Example</Typography>

        </Link>
      </Box>
    </Layout>
  );
};

export default Home;

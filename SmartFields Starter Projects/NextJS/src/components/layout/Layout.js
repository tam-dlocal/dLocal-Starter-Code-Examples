import React from 'react';
import { Box, Container, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import Header from '../Header';
import Footer from '../Footer';

const Layout = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Header onMenuToggle={handleMenuToggle} />
            <Drawer anchor="left" open={isMenuOpen} onClose={handleMenuToggle}>
                <List>
                    <ListItem button>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItem>
                    <ListItem button component="a" href="/checkout">
                        <ListItemIcon>
                            <ShoppingCartIcon />
                        </ListItemIcon>
                        <ListItemText primary="Checkout Example" />
                    </ListItem>
                    {/* Add more menu items here */}
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1 }}>
                <Container sx={{ mt: 4, mb: 4 }}>{children}</Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default Layout;

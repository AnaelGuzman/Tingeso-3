import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom'; // Importa Link de react-router-dom
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RequestPageIcon from '@mui/icons-material/RequestPage';

function Navbar() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const menuItems = [
        { text: 'Volver al Home', path: '/' },
        { text: 'Administrar Tarifas', path: '/fees' },
        { text: 'Administrar Usuarios', path: '/users' },
        { text: 'Administrar Reservas', path: '/adminReserva' },
        { text: 'Reportes', path: '/Reportes' }
    ];

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* AppBar */}
            <AppBar position="fixed" sx={{ background: 'linear-gradient(90deg, #1e3c72, #aaa)', fontFamily: 'sans-serif' }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={toggleDrawer(true)} // Open Drawer
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
                        KARTING RM
                    </Typography>
                    <Button color="inherit" component={Link} to = '/rack'><CalendarTodayIcon/>Rack</Button>
                    <Button color="inherit" component={Link} to = '/customerfees'><AttachMoneyIcon/>Tarifas</Button>
                    <Button color="inherit" component={Link} to = '/checkUsers'><RequestPageIcon/>Realizar Reserva</Button>
                    <Button color="inherit" component={Link} to = '/Reportes'><RequestPageIcon/>Reportes</Button>
                </Toolbar>
            </AppBar>

            {/* Drawer */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)} // Close Drawer
            >
                <Box
                    sx={{ width: 250, background: 'linear-gradient(90deg, #1e3c72, #aaa)', height: '100%', color: '#fffd' }}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton component={Link} to={item.path}>
                                    {/* Usa Link para navegar */}
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
}

export default Navbar;
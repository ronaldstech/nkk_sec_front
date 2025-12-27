import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    useMediaQuery,
    useTheme,
    Drawer,
    AppBar,
    Toolbar,
    IconButton,
    Box
} from '@mui/material';
import {
    Home as HomeIcon,
    Group as GroupIcon,
    ShoppingBag as ShoppingBagIcon,
    Receipt as ReceiptIcon,
    Person as PersonIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    Menu as MenuIcon
} from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';

function MainLayout({ children, menus }) {
    const { user, academic } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // We can infer the "stage" or active menu from the location path
    const getActiveMenu = () => {
        const path = location.pathname;
        if (path === '/') return 'Dashboard';
        if (path.startsWith('/staff')) return 'Staff';
        if (path.startsWith('/students')) return 'Students';
        if (path.startsWith('/academics')) return 'Academics';
        if (path.startsWith('/results')) return 'Results';
        if (path.startsWith('/profile')) return 'Profile';
        if (path.startsWith('/settings')) return 'Settings';
        return 'Dashboard';
    };

    const activeMenu = getActiveMenu();

    const defaultMenus = [
        { title: "Dashboard", icon: <HomeIcon />, path: "/" },
        { title: "Staff", icon: <GroupIcon />, path: "/staff" },
        { title: "Students", icon: <GroupIcon />, path: "/students" },
        { title: "Academics", icon: <ShoppingBagIcon />, path: "/academics" },
        { title: "Results", icon: <ReceiptIcon />, path: "/results" },
        { title: "Profile", icon: <PersonIcon />, path: "/profile" },
        { title: "Settings", icon: <SettingsIcon />, path: "/settings" },
        { title: "Log Out", icon: <LogoutIcon />, action: "logout" }
    ];

    const currentMenus = menus || defaultMenus;

    const handleNavigation = (menu) => {
        if (menu.action === 'logout') {
            window.open("../kkss_open/login.php");
        } else {
            navigate(menu.path);
            if (isMobile) {
                setMobileOpen(false);
            }
        }
    };

    const drawerContent = (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)' // Soft background tint
        }}>
            {/* Profile Header Section */}
            <div className="w3-padding-large w3-center" style={{
                position: 'relative',
                paddingBottom: '24px',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                background: 'linear-gradient(to bottom, rgba(102, 126, 234, 0.05), transparent)'
            }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                        src="images/profile.jpg"
                        className="w3-circle"
                        style={{
                            width: "105px",
                            height: "105px",
                            objectFit: "cover",
                            border: "4px solid white",
                            boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
                        }}
                        alt="User"
                    />
                    {/* Online Status Dot */}
                    <div style={{
                        position: 'absolute',
                        bottom: 5,
                        right: 5,
                        width: 14,
                        height: 14,
                        backgroundColor: '#4caf50',
                        border: '2.5px solid white',
                        borderRadius: '50%'
                    }} />
                </div>

                <Typography variant="h6" sx={{ mt: 1.5, fontWeight: 800, color: '#2d3748', letterSpacing: '-0.5px' }}>
                    {user?.username || 'User'}
                </Typography>

                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 117, 140, 0.1)',
                    padding: '2px 12px',
                    borderRadius: '20px',
                    marginTop: '8px'
                }}>
                    <Typography variant="caption" sx={{ color: '#ff758c', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>
                        {academic.name}
                    </Typography>
                </div>
            </div>

            {/* Menu Items Section */}
            <div style={{ flexGrow: 1, padding: '20px 12px', overflowY: 'auto' }}>
                <List disablePadding>
                    {currentMenus.map((menu, index) => {
                        const isActive = activeMenu === menu.title;
                        return (
                            <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    onClick={() => handleNavigation(menu)}
                                    sx={{
                                        borderRadius: "12px",
                                        position: 'relative',
                                        py: 1.2,
                                        background: isActive
                                            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                            : "transparent",
                                        color: isActive ? "white" : "#4a5568",
                                        boxShadow: isActive ? "0 8px 15px rgba(102, 126, 234, 0.25)" : "none",
                                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                        "&:hover": {
                                            background: isActive
                                                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                                : "rgba(102, 126, 234, 0.08)",
                                            transform: isActive ? "scale(1.02)" : "translateX(4px)"
                                        },
                                        // Active side indicator
                                        "&::before": {
                                            content: '""',
                                            position: 'absolute',
                                            left: -12,
                                            height: isActive ? '24px' : '0px',
                                            width: '4px',
                                            borderRadius: '0 4px 4px 0',
                                            backgroundColor: '#667eea',
                                            transition: 'all 0.3s'
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{
                                        color: isActive ? "white" : "#a0aec0",
                                        minWidth: "38px",
                                        transition: "transform 0.3s",
                                        "& svg": { fontSize: '1.3rem' }
                                    }}>
                                        {menu.icon}
                                    </ListItemIcon>

                                    <ListItemText
                                        primary={menu.title}
                                        primaryTypographyProps={{
                                            fontWeight: isActive ? 600 : 500,
                                            fontSize: '0.9rem',
                                            letterSpacing: isActive ? '0.2px' : '0px'
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </div>

            {/* Footer Section */}
            <div className="w3-padding w3-center" style={{ borderTop: '1px solid rgba(0,0,0,0.03)' }}>
                <Typography
                    variant="caption"
                    sx={{
                        color: 'text.disabled',
                        fontWeight: 600,
                        letterSpacing: '1px',
                        opacity: 0.7
                    }}
                >
                    v1.2.0 • NKK-SEC
                </Typography>
            </div>
        </div>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Mobile AppBar */}
            {isMobile && (
                <AppBar
                    position="fixed"
                    sx={{
                        width: '100%',
                        zIndex: theme.zIndex.drawer + 1,
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: 'none',
                        borderBottom: '1px solid rgba(0,0,0,0.05)'
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, color: 'primary.main' }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div" sx={{ color: 'text.primary', fontWeight: 700 }}>
                            {activeMenu}
                        </Typography>
                    </Toolbar>
                </AppBar>
            )}

            {/* Sidebar Drawer */}
            <Box
                component="nav"
                sx={{ width: { md: 280 }, flexShrink: { md: 0 } }}
            >
                {/* Mobile Drawer (Temporary) */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' },
                    }}
                >
                    {drawerContent}
                </Drawer>

                {/* Desktop Drawer (Permanent/Fixed) */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: 280,
                            position: 'fixed',
                            top: 16,
                            left: 16,
                            height: 'calc(100vh - 32px)',
                            border: 'none',
                            borderRadius: '16px',
                            background: 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                        },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            {/* Content Area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - 280px)` },
                    mt: { xs: 7, md: 0 }, // Add margin top on mobile for AppBar
                    height: '100vh',
                    overflowY: 'auto'
                }}
            >
                <div className="glass-card" style={{ minHeight: '100%', padding: '32px' }}>
                    {children}
                </div>
            </Box>
        </Box>
    );
}

export default MainLayout;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppProvider } from './context/AppContext';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import StaffAdmin from './pages/admin/StaffAdmin';
import StudentsAdmin from './pages/admin/StudentsAdmin';
import Academics from './pages/Academics';
import Results from './pages/Results';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import LogoutDialog from './components/LogoutDialog';
import {
  Home as HomeIcon,
  Group as GroupIcon,
  ShoppingBag as ShoppingBagIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import StaffDashboard from './pages/staff_view/StaffDashboard';
import StaffStaff from './pages/staff_view/StaffStaff';
import StaffStudents from './pages/staff_view/StaffStudents';
import StaffAcademics from './pages/staff_view/StaffAcademics';
// Profile and Logout are shared

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea', // Soft Indigo
      dark: '#5a67d8',
      light: '#7f9cf5',
      contrastText: '#fff'
    },
    secondary: {
      main: '#ff758c', // Soft Rose
      contrastText: '#fff'
    },
    background: {
      default: 'transparent', // Handled by body CSS
      paper: 'rgba(255, 255, 255, 0.8)', // Semi-transparent for glass effect
    },
    text: {
      primary: '#2d3748',
      secondary: '#718096',
    }
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '2.5rem' },
    h2: { fontFamily: "'Poppins', sans-serif", fontWeight: 600 },
    h3: { fontFamily: "'Poppins', sans-serif", fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          padding: "8px 24px",
          boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
          transition: "all 0.2s ease-in-out",
          '&:hover': {
            transform: "translateY(-1px)",
            boxShadow: "0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)",
          }
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
        containedSecondary: {
          background: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
        },
        containedError: {
          background: "linear-gradient(135deg, #ff5f6d 0%, #ffc371 100%)", // Orange-Red gradient
          color: "white"
        },
        containedSuccess: {
          background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", // Green gradient
          color: "white"
        }

      },
      defaultProps: {
        disableElevation: true, // Let custom shadows handle depth
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          backgroundColor: "rgba(255, 255, 255, 0.85)", // Glassy
          border: "1px solid rgba(255, 255, 255, 0.3)",
        },
        elevation1: {
          boxShadow: "0 4px 6px rgba(0,0,0,0.02), 0 10px 15px rgba(0,0,0,0.03)",
        },
        elevation2: {
          boxShadow: "0 10px 25px rgba(0,0,0,0.05), 0 20px 48px rgba(0,0,0,0.05)", // Soft deep shadow
        }
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
          padding: "16px",
        },
        head: {
          fontWeight: 600,
          color: "#4a5568",
          backgroundColor: "rgba(247, 250, 252, 0.5)",
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: "rgba(203, 213, 224, 0.6)",
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: "#a0aec0",
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: "#667eea",
            borderWidth: "2px",
          },
          backgroundColor: "rgba(255, 255, 255, 0.6)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "24px",
          overflow: 'hidden'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRight: "none",
          boxShadow: "4px 0 24px rgba(0,0,0,0.02)"
        }
      }
    }
  }
});

const adminMenus = [
  { title: "Dashboard", icon: <HomeIcon />, path: "/" },
  { title: "Staff", icon: <GroupIcon />, path: "/staff" },
  { title: "Students", icon: <GroupIcon />, path: "/students" },
  { title: "Academics", icon: <ShoppingBagIcon />, path: "/academics" },
  { title: "Results", icon: <ReceiptIcon />, path: "/results" },
  { title: "Profile", icon: <PersonIcon />, path: "/profile" },
  { title: "Settings", icon: <SettingsIcon />, path: "/settings" },
  { title: "Log Out", icon: <LogoutIcon />, action: "logout" }
];

const staffMenus = [
  { title: "Dashboard", icon: <HomeIcon />, path: "/portal/staff" },
  { title: "Staff", icon: <GroupIcon />, path: "/portal/staff/staff" },
  { title: "Students", icon: <GroupIcon />, path: "/portal/staff/students" },
  { title: "Academics", icon: <ShoppingBagIcon />, path: "/portal/staff/academics" },
  { title: "Profile", icon: <PersonIcon />, path: "/profile" }, // Shared profile path, might need context adjustment if profile differs
  { title: "Log Out", icon: <LogoutIcon />, action: "logout" }
];

import Login from './pages/Login';
import { useAppContext } from './context/AppContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAppContext();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route path="/*" element={
              <ProtectedRoute>
                <MainLayout menus={adminMenus}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/admin" element={<Navigate to="/" replace />} />
                    <Route path="/dashboard" element={<Navigate to="/" replace />} />
                    <Route path="/staff" element={<StaffAdmin />} />
                    <Route path="/students" element={<StudentsAdmin />} />
                    <Route path="/academics" element={<Academics />} />
                    <Route path="/results" element={<Results />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/logout" element={<LogoutDialog />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            } />

            {/* Staff Routes */}
            <Route path="/portal/staff/*" element={
              <ProtectedRoute>
                <MainLayout menus={staffMenus}>
                  <Routes>
                    <Route path="/" element={<StaffDashboard />} />
                    <Route path="/staff" element={<StaffStaff />} />
                    <Route path="/students" element={<StaffStudents />} />
                    <Route path="/academics" element={<StaffAcademics />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;

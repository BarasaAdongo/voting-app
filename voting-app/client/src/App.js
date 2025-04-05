import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import PollList from './components/PollList';
import CreatePoll from './components/CreatePoll';
import ViewPoll from './components/ViewPoll';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7C3AED',
      dark: '#6D28D9',
      light: '#A78BFA',
    },
    secondary: {
      main: '#10B981',
      dark: '#059669',
      light: '#34D399',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        InputLabelProps: {
          required: false,
        },
      },
      styleOverrides: {
        root: {
          '& label': {
            fontSize: '0.95rem',
            fontWeight: 500,
          },
          '& input': {
            fontSize: '1rem',
            fontWeight: 400,
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          color: '#1F2937',
          '& .MuiListItemIcon-root': {
            color: '#7C3AED',
          },
          '& .MuiListItemText-root': {
            color: '#1F2937',
          },
          '& .Mui-selected': {
            backgroundColor: 'rgba(124, 58, 237, 0.08) !important',
            '& .MuiListItemIcon-root': {
              color: '#7C3AED',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#1F2937',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});

const drawerWidth = 240;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Navbar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              ml: { sm: `${drawerWidth}px` },
              mt: { xs: '64px', sm: '64px' }, // Add top margin for AppBar
            }}
          >
            <Routes>
              <Route path="/" element={<PollList />} />
              <Route path="/create" element={<CreatePoll />} />
              <Route path="/poll/:id" element={<ViewPoll />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 
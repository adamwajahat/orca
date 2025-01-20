import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import AnalyticsPage from './pages/AnalyticsPage';
import LiveFeedPage from './pages/LiveFeedPage';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3', // Ocean blue
    },
    secondary: {
      main: '#00C853', // Environmental green
    },
  },
  typography: {
    h2: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 500,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/live-feed" element={<LiveFeedPage />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;

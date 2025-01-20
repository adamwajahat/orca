import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Paper, Typography, CircularProgress, useTheme } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import useApi from '../hooks/useApi';
import ErrorAlert from '../components/ErrorAlert';

// Register only the chart components we need
ChartJS.register(ArcElement, Tooltip, Legend);

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
  },
  animation: `${fadeIn} 0.6s ease-out`,
}));

const MetricValue = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: theme.palette.secondary.main,
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const MetricLabel = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const ChartContainer = styled(Box)(({ theme }) => ({
  height: 250,
  marginTop: theme.spacing(2),
}));

const AnalyticsPage = () => {
  const [realTimeData, setRealTimeData] = useState(null);
  const [cumulativeData, setCumulativeData] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [environmentalData, setEnvironmentalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchData, error, loading: apiLoading, setError } = useApi();
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [realTime, cumulative, performance, environmental] = await Promise.all([
          fetch('http://localhost:3000/api/real-time').then(res => res.json()),
          fetch('http://localhost:3000/api/cumulative').then(res => res.json()),
          fetch('http://localhost:3000/api/performance').then(res => res.json()),
          fetch('http://localhost:3000/api/environmental-impact').then(res => res.json()),
        ]);

        setRealTimeData(realTime);
        setCumulativeData(cumulative);
        setPerformanceData(performance);
        setEnvironmentalData(environmental);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} thickness={4} color="secondary" />
      </Box>
    );
  }

  // Prepare chart data for trash type breakdown
  const trashTypeData = {
    labels: ['Plastic', 'Metal', 'Organic'],
    datasets: [{
      data: [
        cumulativeData?.plastic || 0,
        cumulativeData?.metal || 0,
        cumulativeData?.organic || 0,
      ],
      backgroundColor: [
        theme.palette.primary.light,
        theme.palette.secondary.light,
        theme.palette.success.light,
      ],
      borderColor: [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main,
      ],
      borderWidth: 2,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <Box sx={{
      background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
      minHeight: '100vh',
      pt: 4,
      pb: 8,
    }}>
      <ErrorAlert error={error} onClose={() => setError(null)} />
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          fontWeight: 'bold', 
          color: theme.palette.primary.main,
          textAlign: 'center',
          mb: 6,
          animation: `${fadeIn} 0.8s ease-out`,
        }}>
          Analytics Dashboard
        </Typography>

        <Grid container spacing={4}>
          {/* Real-Time Status */}
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                Real-Time Status
              </Typography>
              <Box sx={{ mb: 3 }}>
                <MetricLabel>Current Status</MetricLabel>
                <MetricValue>{realTimeData?.robot_status || 'N/A'}</MetricValue>
              </Box>
              <Box>
                <MetricLabel>Recent Collection</MetricLabel>
                <MetricValue>{realTimeData?.trash_collected || 0} kg</MetricValue>
              </Box>
            </StyledPaper>
          </Grid>

          {/* Cumulative Data */}
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                Total Collection
              </Typography>
              <Box sx={{ mb: 3 }}>
                <MetricLabel>Total Trash Collected</MetricLabel>
                <MetricValue>{cumulativeData?.total_trash_collected || 0} kg</MetricValue>
              </Box>
              <ChartContainer>
                <Pie data={trashTypeData} options={chartOptions} />
              </ChartContainer>
            </StyledPaper>
          </Grid>

          {/* Performance Metrics */}
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                Performance Metrics
              </Typography>
              <Box sx={{ mb: 3 }}>
                <MetricLabel>Efficiency Rate</MetricLabel>
                <MetricValue>{performanceData?.efficiency || 0} kg/hour</MetricValue>
              </Box>
              <Box>
                <MetricLabel>Operational Time</MetricLabel>
                <MetricValue>{Math.round((performanceData?.operational_time || 0) / 60)} hours</MetricValue>
              </Box>
            </StyledPaper>
          </Grid>

          {/* Environmental Impact */}
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                Environmental Impact
              </Typography>
              <Box sx={{ mb: 3 }}>
                <MetricLabel>Pollution Reduction</MetricLabel>
                <MetricValue>{environmentalData?.pollution_reduction || 0} kg</MetricValue>
              </Box>
              <Box>
                <MetricLabel>Carbon Offset</MetricLabel>
                <MetricValue>{environmentalData?.carbon_offset || 0} kg CO₂</MetricValue>
              </Box>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AnalyticsPage;


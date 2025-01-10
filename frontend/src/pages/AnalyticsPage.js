import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
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

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const MetricValue = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 'bold',
  color: theme.palette.primary.main,
}));

const AnalyticsPage = () => {
  const [realTimeData, setRealTimeData] = useState(null);
  const [cumulativeData, setCumulativeData] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [environmentalData, setEnvironmentalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchData, error, loading: apiLoading, setError } = useApi();

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
        <CircularProgress />
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
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(75, 192, 192, 0.8)',
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(75, 192, 192, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <>
      <ErrorAlert error={error} onClose={() => setError(null)} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Analytics Dashboard
        </Typography>

        <Grid container spacing={3}>
          {/* Real-Time Status */}
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Real-Time Status
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Current Status</Typography>
                <MetricValue>{realTimeData?.robot_status || 'N/A'}</MetricValue>
              </Box>
              <Box>
                <Typography variant="subtitle1">Recent Collection</Typography>
                <MetricValue>{realTimeData?.trash_collected || 0} kg</MetricValue>
              </Box>
            </StyledPaper>
          </Grid>

          {/* Cumulative Data */}
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Total Collection
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Total Trash Collected</Typography>
                <MetricValue>{cumulativeData?.total_trash_collected || 0} kg</MetricValue>
              </Box>
              <Box sx={{ height: 200 }}>
                <Pie data={trashTypeData} options={chartOptions} />
              </Box>
            </StyledPaper>
          </Grid>

          {/* Performance Metrics */}
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Performance Metrics
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Efficiency Rate</Typography>
                <MetricValue>{performanceData?.efficiency || 0} kg/hour</MetricValue>
              </Box>
              <Box>
                <Typography variant="subtitle1">Operational Time</Typography>
                <MetricValue>{Math.round((performanceData?.operational_time || 0) / 60)} hours</MetricValue>
              </Box>
            </StyledPaper>
          </Grid>

          {/* Environmental Impact */}
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Environmental Impact
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Pollution Reduction</Typography>
                <MetricValue>{environmentalData?.pollution_reduction || 0} kg</MetricValue>
              </Box>
              <Box>
                <Typography variant="subtitle1">Carbon Offset</Typography>
                <MetricValue>{environmentalData?.carbon_offset || 0} kg CO₂</MetricValue>
              </Box>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AnalyticsPage; 
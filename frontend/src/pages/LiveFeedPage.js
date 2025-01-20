import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Grid, Paper, Typography, Chip, CircularProgress, useTheme } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SpeedIcon from '@mui/icons-material/Speed';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import useApi from '../hooks/useApi';
import ErrorAlert from '../components/ErrorAlert';

// Fix for the Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

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

const MapWrapper = styled(Box)(({ theme }) => ({
  height: '500px',
  width: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor: status === 'Active' 
    ? theme.palette.success.main 
    : status === 'Idle'
    ? theme.palette.warning.main
    : theme.palette.error.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  padding: theme.spacing(1, 2),
  fontSize: '1rem',
}));

const MetricBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
  },
}));

const MetricValue = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: theme.palette.secondary.main,
}));

const LiveFeedPage = () => {
  const [robotData, setRobotData] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const { fetchData, error, loading, setError } = useApi();
  const theme = useTheme();
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Default position (will be updated when data is fetched)
  const defaultPosition = [37.7749, -122.4194];

  useEffect(() => {
    const getRobotData = async () => {
      try {
        const data = await fetchData('http://localhost:3000/api/real-time');
        
        // Smooth update of marker position if map is ready
        if (mapReady && markerRef.current && data) {
          const newLatLng = [data.latitude, data.longitude];
          markerRef.current.setLatLng(newLatLng);
          mapRef.current.panTo(newLatLng, { animate: true, duration: 1 });
        }

        // Update other data smoothly
        setRobotData(prevData => ({
          ...prevData,
          ...data,
          trash_collected: data.trash_collected,
          robot_status: data.robot_status,
        }));

      } catch (error) {
        console.error('Error fetching robot data:', error);
      }
    };

    // Initial data fetch
    getRobotData();

    // Set up interval for subsequent updates
    const interval = setInterval(getRobotData, 5000);
    return () => clearInterval(interval);
  }, [fetchData, mapReady]);

  // Custom marker component with ref
  const MarkerComponent = () => {
    const marker = useRef(null);
    
    useEffect(() => {
      if (marker.current) {
        markerRef.current = marker.current;
      }
    }, []);

    return (
      <Marker 
        position={robotData ? [robotData.latitude, robotData.longitude] : defaultPosition}
        ref={marker}
      >
        <Popup>
          Robot is currently here
          <br />
          Status: {robotData?.robot_status || 'Unknown'}
        </Popup>
      </Marker>
    );
  };

  // Initial loading state
  if (loading && !robotData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} thickness={4} color="secondary" />
      </Box>
    );
  }

  const position = robotData ? [robotData.latitude, robotData.longitude] : defaultPosition;

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
          Live Robot Feed
        </Typography>

        <Grid container spacing={4}>
          {/* Map Section */}
          <Grid item xs={12}>
            <StyledPaper>
              <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 3 }}>
                Current Location
              </Typography>
              <MapWrapper>
                <MapContainer
                  center={position}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  ref={mapRef}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <MarkerComponent />
                </MapContainer>
              </MapWrapper>
            </StyledPaper>
          </Grid>

          {/* Status Section */}
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 3 }}>
                Robot Status
              </Typography>
              <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                <StatusChip
                  label={robotData?.robot_status || 'Unknown'}
                  status={robotData?.robot_status || 'Unknown'}
                />
              </Box>
              <MetricBox>
                <LocationOnIcon color="primary" sx={{ fontSize: 30 }} />
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">Location</Typography>
                  <MetricValue>
                    {position[0].toFixed(4)}°N, {position[1].toFixed(4)}°W
                  </MetricValue>
                </Box>
              </MetricBox>
              <MetricBox>
                <DeleteSweepIcon color="primary" sx={{ fontSize: 30 }} />
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">Recent Collection</Typography>
                  <MetricValue>
                    {robotData?.trash_collected || 0} kg
                  </MetricValue>
                </Box>
              </MetricBox>
            </StyledPaper>
          </Grid>

          {/* Performance Section */}
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 3 }}>
                Performance Metrics
              </Typography>
              <MetricBox>
                <SpeedIcon color="primary" sx={{ fontSize: 30 }} />
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">Operating Speed</Typography>
                  <MetricValue>
                    {(Math.random() * 5 + 2).toFixed(1)} km/h
                  </MetricValue>
                </Box>
              </MetricBox>
              <MetricBox>
                <BatteryChargingFullIcon color="primary" sx={{ fontSize: 30 }} />
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">Battery Level</Typography>
                  <MetricValue>
                    {Math.floor(Math.random() * 30 + 70)}%
                  </MetricValue>
                </Box>
              </MetricBox>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LiveFeedPage;


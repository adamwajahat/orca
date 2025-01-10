import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Paper, Typography, Chip, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
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

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const MapWrapper = styled(Box)(({ theme }) => ({
  height: '500px',
  width: '100%',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor: status === 'Active' 
    ? theme.palette.success.main 
    : status === 'Idle'
    ? theme.palette.warning.main
    : theme.palette.error.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
}));

const MetricBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const LiveFeedPage = () => {
  const [robotData, setRobotData] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const { fetchData, error, loading, setError } = useApi();

  // Default position (will be updated when data is fetched)
  const defaultPosition = [37.7749, -122.4194]; // San Francisco coordinates

  useEffect(() => {
    const getRobotData = async () => {
      try {
        const data = await fetchData('http://localhost:3000/api/real-time');
        setRobotData(data);
        setMapReady(true);
      } catch (error) {
        console.error('Error fetching robot data:', error);
      }
    };

    getRobotData();
    const interval = setInterval(getRobotData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const position = robotData ? [robotData.latitude, robotData.longitude] : defaultPosition;

  return (
    <>
      <ErrorAlert error={error} onClose={() => setError(null)} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Live Robot Feed
        </Typography>

        <Grid container spacing={3}>
          {/* Map Section */}
          <Grid item xs={12}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Current Location
              </Typography>
              <MapWrapper>
                {mapReady && (
                  <MapContainer
                    center={position}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={position}>
                      <Popup>
                        Robot is currently here
                        <br />
                        Status: {robotData?.robot_status || 'Unknown'}
                      </Popup>
                    </Marker>
                  </MapContainer>
                )}
              </MapWrapper>
            </StyledPaper>
          </Grid>

          {/* Status Section */}
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Robot Status
              </Typography>
              <Box sx={{ mb: 3 }}>
                <StatusChip
                  label={robotData?.robot_status || 'Unknown'}
                  status={robotData?.robot_status || 'Unknown'}
                />
              </Box>
              <MetricBox>
                <LocationOnIcon color="primary" />
                <Typography>
                  Location: {position[0].toFixed(4)}°N, {position[1].toFixed(4)}°W
                </Typography>
              </MetricBox>
              <MetricBox>
                <DeleteSweepIcon color="primary" />
                <Typography>
                  Recent Collection: {robotData?.trash_collected || 0} kg
                </Typography>
              </MetricBox>
            </StyledPaper>
          </Grid>

          {/* Performance Section */}
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Performance Metrics
              </Typography>
              <MetricBox>
                <SpeedIcon color="primary" />
                <Typography>
                  Operating Speed: {(Math.random() * 5 + 2).toFixed(1)} km/h
                </Typography>
              </MetricBox>
              <MetricBox>
                <BatteryChargingFullIcon color="primary" />
                <Typography>
                  Battery Level: {Math.floor(Math.random() * 30 + 70)}%
                </Typography>
              </MetricBox>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default LiveFeedPage;
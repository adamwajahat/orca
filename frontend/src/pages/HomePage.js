import React from 'react';
import { Box, Container, Typography, Grid, Paper, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import WavesIcon from '@mui/icons-material/Waves';
import TimelineIcon from '@mui/icons-material/Timeline';
import MapIcon from '@mui/icons-material/Map';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white',
  padding: theme.spacing(8, 0, 6),
  marginBottom: theme.spacing(4),
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  fontSize: '3rem',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
}));

const HomePage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            gutterBottom
          >
            Ocean Cleanup Robot Analytics
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="inherit"
            paragraph
          >
            Monitor and analyze the performance of our ocean cleaning robot in real-time.
            Track environmental impact, efficiency metrics, and cleaning progress.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              component={Link}
              to="/analytics"
              variant="contained"
              color="secondary"
              size="large"
            >
              View Analytics
            </Button>
            <Button
              component={Link}
              to="/live-feed"
              variant="outlined"
              color="inherit"
              size="large"
            >
              Live Feed
            </Button>
          </Box>
        </Container>
      </HeroSection>

      {/* Features Grid */}
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Real-Time Monitoring */}
          <Grid item xs={12} md={4}>
            <StyledPaper elevation={3}>
              <IconWrapper>
                <TimelineIcon fontSize="inherit" />
              </IconWrapper>
              <Typography variant="h5" component="h2" gutterBottom>
                Real-Time Monitoring
              </Typography>
              <Typography color="text.secondary">
                Track the robot's performance, status, and collected waste metrics in real-time
                with interactive dashboards and visualizations.
              </Typography>
            </StyledPaper>
          </Grid>

          {/* Environmental Impact */}
          <Grid item xs={12} md={4}>
            <StyledPaper elevation={3}>
              <IconWrapper>
                <WavesIcon fontSize="inherit" />
              </IconWrapper>
              <Typography variant="h5" component="h2" gutterBottom>
                Environmental Impact
              </Typography>
              <Typography color="text.secondary">
                Measure the positive impact on ocean ecosystems through pollution reduction
                metrics and carbon offset calculations.
              </Typography>
            </StyledPaper>
          </Grid>

          {/* Location Tracking */}
          <Grid item xs={12} md={4}>
            <StyledPaper elevation={3}>
              <IconWrapper>
                <MapIcon fontSize="inherit" />
              </IconWrapper>
              <Typography variant="h5" component="h2" gutterBottom>
                Location Tracking
              </Typography>
              <Typography color="text.secondary">
                View the robot's current location and cleaning path on an interactive map
                with detailed coverage analysis.
              </Typography>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage; 
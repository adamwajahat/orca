import React from 'react';
import { Box, Container, Typography, Grid, Paper, Button, useTheme } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import WavesIcon from '@mui/icons-material/Waves';
import TimelineIcon from '@mui/icons-material/Timeline';
import MapIcon from '@mui/icons-material/Map';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'all 0.3s ease-in-out',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
  },
  animation: `${fadeIn} 0.6s ease-out`,
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: 'white',
  padding: theme.spacing(12, 0, 10),
  marginBottom: theme.spacing(8),
  borderRadius: '0 0 50% 50% / 4%',
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  fontSize: '4rem',
  marginBottom: theme.spacing(3),
  color: theme.palette.secondary.main,
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const AnimatedTypography = styled(Typography)`
  animation: ${fadeIn} 0.8s ease-out;
`;

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 5,
  padding: theme.spacing(1.5, 4),
  fontWeight: 'bold',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
  },
}));

const HomePage = () => {
  const theme = useTheme();

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="md">
          <AnimatedTypography
            component="h1"
            variant="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 3 }}
          >
            Ocean Cleanup Robot Analytics
          </AnimatedTypography>
          <AnimatedTypography
            variant="h5"
            align="center"
            color="inherit"
            paragraph
            sx={{ mb: 5, opacity: 0.9 }}
          >
            Monitor and analyze the performance of our ocean cleaning robot in real-time.
            Track environmental impact, efficiency metrics, and cleaning progress.
          </AnimatedTypography>
          <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', gap: 3 }}>
            <StyledButton
              component={Link}
              to="/analytics"
              variant="contained"
              color="secondary"
              size="large"
            >
              View Analytics
            </StyledButton>
            <StyledButton
              component={Link}
              to="/live-feed"
              variant="outlined"
              sx={{ 
                color: 'white', 
                borderColor: 'white',
                '&:hover': {
                  borderColor: theme.palette.secondary.light,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
              size="large"
            >
              Live Feed
            </StyledButton>
          </Box>
        </Container>
      </HeroSection>

      {/* Features Grid */}
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Real-Time Monitoring */}
          <Grid item xs={12} md={4}>
            <StyledPaper elevation={0}>
              <IconWrapper>
                <TimelineIcon fontSize="inherit" />
              </IconWrapper>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Real-Time Monitoring
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                Track the robot's performance, status, and collected waste metrics in real-time
                with interactive dashboards and visualizations.
              </Typography>
            </StyledPaper>
          </Grid>

          {/* Environmental Impact */}
          <Grid item xs={12} md={4}>
            <StyledPaper elevation={0}>
              <IconWrapper>
                <WavesIcon fontSize="inherit" />
              </IconWrapper>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Environmental Impact
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                Measure the positive impact on ocean ecosystems through pollution reduction
                metrics and carbon offset calculations.
              </Typography>
            </StyledPaper>
          </Grid>

          {/* Location Tracking */}
          <Grid item xs={12} md={4}>
            <StyledPaper elevation={0}>
              <IconWrapper>
                <MapIcon fontSize="inherit" />
              </IconWrapper>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Location Tracking
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
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


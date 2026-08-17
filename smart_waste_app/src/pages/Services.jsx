import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import MonitorIcon from "@mui/icons-material/Monitor";
import AssignmentIcon from "@mui/icons-material/Assignment";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import InsightsIcon from "@mui/icons-material/Insights";
import RoomIcon from "@mui/icons-material/Room";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { ADMIN_LOCATION, DEFAULT_USER_LOCATION } from "../utils/distance";

const services = [
  {
    title: "Real-time Monitoring",
    desc: "Track dustbin levels and locations instantly.",
    icon: <MonitorIcon sx={{ fontSize: 50, color: "#4facfe" }} />,
  },
  {
    title: "Driver Assignment",
    desc: "Admins can assign tasks to drivers efficiently.",
    icon: <AssignmentIcon sx={{ fontSize: 50, color: "#00f2fe" }} />,
  },
  {
    title: "User Notifications",
    desc: "Users can report issues and find nearest bins.",
    icon: <NotificationsActiveIcon sx={{ fontSize: 50, color: "#ff6b6b" }} />,
  },
  {
    title: "ML Predictions",
    desc: "Predict dustbin overflow using AI.",
    icon: <InsightsIcon sx={{ fontSize: 50, color: "#ffa500" }} />,
  },
];

const serviceCardStyles = {
  p: 5,
  minHeight: 230,
  textAlign: "center",
  borderRadius: 4,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  transition: "all 0.3s ease",
  cursor: "pointer",
  backgroundColor: "#d3f5fa",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
  },
};

export default function Services() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6BC1FF 0%, #00C49F 100%)",
        py: 10,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            mb: 8,
            color: "#fff",
            textShadow: "2px 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          Our Services
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {services.map((service) => (
            <Grid key={service.title} size={{ xs: 12, sm: 10, md: 5 }}>
              <Paper elevation={10} sx={serviceCardStyles}>
                <Box sx={{ mb: 3 }}>{service.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}

          <Grid size={{ xs: 12, md: 10 }}>
            <Paper
              elevation={12}
              sx={{
                p: { xs: 3, md: 6 },
                borderRadius: 4,
                background: "linear-gradient(145deg, #b1cbfb 0%, #9ee2eb 100%)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 3,
                  textAlign: "center",
                }}
              >
                <RoomIcon sx={{ fontSize: 60, color: "#00bfa5", mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                  Map View of Dustbins
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ maxWidth: 700 }}
                >
                  Visualize all the dustbins in your city on a map. Zoom in, track real-time
                  fill levels, and navigate efficiently.
                </Typography>
              </Box>

              <Box
                sx={{
                  mt: 4,
                  width: "100%",
                  maxWidth: 900,
                  mx: "auto",
                  height: { xs: 300, sm: 400 },
                  borderRadius: 3,
                  overflow: "hidden",
                  backgroundColor: "#ccefff",
                }}
              >
                <LoadScript googleMapsApiKey="AIzaSyC0-lqy3ZqznggF1jqe6fjyx4pjwIy2-UI">
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={DEFAULT_USER_LOCATION}
                    zoom={12}
                  >
                    <Marker position={DEFAULT_USER_LOCATION} label="Dustbin" />
                    <Marker position={ADMIN_LOCATION} label="Admin" />
                  </GoogleMap>
                </LoadScript>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

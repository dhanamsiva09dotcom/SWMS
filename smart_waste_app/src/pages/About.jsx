import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import DirectionsIcon from "@mui/icons-material/Directions";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";

const pillars = [
  {
    title: "Automated monitoring",
    desc: "Dustbins report live fill levels and condition updates to reduce overflow risk.",
    icon: <InfoIcon color="primary" fontSize="large" />,
  },
  {
    title: "Real-time location",
    desc: "Residents and teams can view nearby bins on live maps for faster decisions.",
    icon: <GpsFixedIcon color="primary" fontSize="large" />,
  },
  {
    title: "Optimized routes",
    desc: "Drivers can follow priority-based work routes that save time and fuel.",
    icon: <DirectionsIcon color="primary" fontSize="large" />,
  },
  {
    title: "Sustainable impact",
    desc: "Cleaner streets and fewer missed collections help build healthier communities.",
    icon: <LocalFloristIcon color="primary" fontSize="large" />,
  },
];

export default function About() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 10 },
        background:
          "radial-gradient(circle at top right, rgba(34,211,238,0.18), transparent 28%), linear-gradient(180deg, #ecfeff 0%, #f8fffd 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 6,
            background: "rgba(255,255,255,0.82)",
            border: "1px solid rgba(15, 118, 110, 0.12)",
            boxShadow: "0 24px 50px rgba(15, 23, 42, 0.08)",
          }}
        >
          <Typography
            variant="overline"
            sx={{ letterSpacing: 1.6, color: "#0f766e", fontWeight: 700 }}
          >
            About The Platform
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, color: "#0b2239" }}>
            Waste management with stronger visibility and faster action.
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "#486581", lineHeight: 1.8, fontWeight: 400, maxWidth: 940 }}
          >
            Our platform combines smart IoT-enabled dustbins, real-time Firebase updates, route
            planning, and complaint workflows into one connected system for residents, drivers,
            and administrators.
          </Typography>

          <Grid container spacing={3} sx={{ mt: 3 }}>
            {pillars.map((pillar) => (
              <Grid key={pillar.title} size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: 3,
                    display: "flex",
                    gap: 2,
                    alignItems: "flex-start",
                    borderRadius: 4,
                    background: "linear-gradient(135deg, #f0fdff 0%, #f8fffd 100%)",
                    border: "1px solid rgba(14, 116, 144, 0.12)",
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "18px",
                      display: "grid",
                      placeItems: "center",
                      background: "rgba(34, 211, 238, 0.14)",
                      flexShrink: 0,
                    }}
                  >
                    {pillar.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: "#102a43" }}>
                      {pillar.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#486581", lineHeight: 1.8 }}>
                      {pillar.desc}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Typography
            variant="body1"
            sx={{ mt: 4, color: "#334e68", lineHeight: 1.9, maxWidth: 1000 }}
          >
            From reporting damaged bins to tracking maintenance progress, the system is designed to
            reduce guesswork and improve coordination. The result is a cleaner, more responsive, and
            more sustainable waste management workflow.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

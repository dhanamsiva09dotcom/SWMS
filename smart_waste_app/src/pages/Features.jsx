import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import SensorsRoundedIcon from "@mui/icons-material/SensorsRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import BuildCircleRoundedIcon from "@mui/icons-material/BuildCircleRounded";

const features = [
  {
    title: "IoT Enabled",
    desc: "Ultrasonic sensors detect dustbin levels accurately and help prevent overflow.",
    icon: <SensorsRoundedIcon sx={{ fontSize: 34 }} />,
  },
  {
    title: "GPS Tracking",
    desc: "Locate every smart dustbin in real time and improve field visibility instantly.",
    icon: <LocationOnRoundedIcon sx={{ fontSize: 34 }} />,
  },
  {
    title: "Driver Routing",
    desc: "Shorter collection paths reduce delay, save fuel, and improve response time.",
    icon: <LocalShippingRoundedIcon sx={{ fontSize: 34 }} />,
  },
  {
    title: "Complaint Workflow",
    desc: "Residents can raise issues quickly while admins and drivers track progress live.",
    icon: <BuildCircleRoundedIcon sx={{ fontSize: 34 }} />,
  },
];

export default function Features() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 10 },
        background:
          "radial-gradient(circle at top left, rgba(52,211,153,0.18), transparent 28%), linear-gradient(180deg, #f0fdfa 0%, #f8fbff 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="overline"
          align="center"
          sx={{ display: "block", color: "#0f766e", letterSpacing: 1.8, fontWeight: 700 }}
        >
          Product Features
        </Typography>
        <Typography
          variant="h3"
          align="center"
          sx={{ fontWeight: 900, color: "#0b2239", mb: 1.5 }}
        >
          Built for clarity, speed, and cleaner operations
        </Typography>
        <Typography
          variant="h6"
          align="center"
          sx={{ mb: 5, color: "#486581", fontWeight: 400, maxWidth: 780, mx: "auto" }}
        >
          The platform connects sensor readings, maintenance workflows, and routing decisions in
          one clean operational view.
        </Typography>

        <Grid container spacing={3}>
          {features.map((feature) => (
            <Grid key={feature.title} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  p: 3.5,
                  borderRadius: 5,
                  textAlign: "left",
                  background: "#ffffff",
                  border: "1px solid rgba(14, 116, 144, 0.12)",
                  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
                  transition: "transform 0.28s ease, box-shadow 0.28s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 22px 48px rgba(15, 23, 42, 0.12)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 58,
                    height: 58,
                    mb: 2,
                    borderRadius: "18px",
                    display: "grid",
                    placeItems: "center",
                    background: "linear-gradient(135deg, #22d3ee 0%, #34d399 100%)",
                    color: "#0b2239",
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: "#102a43" }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#486581", lineHeight: 1.8 }}>
                  {feature.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

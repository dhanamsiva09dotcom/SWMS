import { Box, Button, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import RecyclingRoundedIcon from "@mui/icons-material/RecyclingRounded";
import { Link } from "react-router-dom";

const highlights = [
  { label: "Live fill tracking", value: "24/7" },
  { label: "Route optimization", value: "AI assisted" },
  { label: "Response workflow", value: "Real time" },
];

const featureCards = [
  {
    title: "Live Sensor Intelligence",
    desc: "Monitor dustbin fill level changes instantly through Firebase-backed updates.",
    icon: <InsightsRoundedIcon sx={{ fontSize: 34 }} />,
  },
  {
    title: "Smarter Collection Routes",
    desc: "Guide drivers to the right bins faster with location-aware work assignments.",
    icon: <RouteRoundedIcon sx={{ fontSize: 34 }} />,
  },
  {
    title: "Cleaner Communities",
    desc: "Reduce overflow complaints and improve city hygiene with faster maintenance cycles.",
    icon: <RecyclingRoundedIcon sx={{ fontSize: 34 }} />,
  },
];

export default function Home() {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at top left, rgba(34, 211, 238, 0.24), transparent 34%), linear-gradient(135deg, #0b2239 0%, #0f766e 55%, #34d399 100%)",
        color: "#f8fffd",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          opacity: 0.3,
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", py: { xs: 9, md: 12 } }}>
        <Grid container spacing={5} alignItems="center">
          <Grid size={{ xs: 12, lg: 7 }}>
            <Stack spacing={3}>
              <Chip
                label="IoT + Firebase + Smart Routing"
                sx={{
                  alignSelf: "flex-start",
                  fontWeight: 700,
                  color: "#dafeff",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              />

              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  lineHeight: 1.02,
                  letterSpacing: -1.5,
                  fontSize: { xs: "2.7rem", md: "4.9rem" },
                  maxWidth: 820,
                }}
              >
                Smarter waste collection starts with clearer live data.
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  maxWidth: 720,
                  color: "rgba(248,255,253,0.84)",
                  lineHeight: 1.8,
                  fontWeight: 400,
                }}
              >
                Track dustbin levels in real time, assign field work faster, and keep residents,
                drivers, and admins connected through one intelligent platform.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 99,
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #facc15 0%, #fb7185 100%)",
                    color: "#102a43",
                    boxShadow: "0 20px 35px rgba(251, 113, 133, 0.28)",
                  }}
                >
                  Open Dashboard
                </Button>
                <Button
                  component={Link}
                  to="/services"
                  variant="outlined"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 99,
                    fontWeight: 700,
                    color: "#f8fffd",
                    borderColor: "rgba(255,255,255,0.28)",
                  }}
                >
                  Explore Services
                </Button>
              </Stack>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 6,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.14)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 30px 60px rgba(4, 14, 24, 0.28)",
              }}
            >
              <Stack spacing={2.5}>
                <Typography variant="overline" sx={{ color: "#dafeff", letterSpacing: 1.6 }}>
                  Platform Snapshot
                </Typography>
                {highlights.map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      p: 2.2,
                      borderRadius: 4,
                      background: "rgba(4, 14, 24, 0.22)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "rgba(248,255,253,0.72)" }}>
                      {item.label}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: { xs: 6, md: 8 } }}>
          {featureCards.map((card) => (
            <Grid key={card.title} size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  height: "100%",
                  p: 3,
                  borderRadius: 5,
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <Box
                  sx={{
                    width: 58,
                    height: 58,
                    mb: 2,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: "18px",
                    background: "linear-gradient(135deg, #22d3ee 0%, #34d399 100%)",
                    color: "#073b4c",
                  }}
                >
                  {card.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  {card.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(248,255,253,0.74)", lineHeight: 1.8 }}>
                  {card.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

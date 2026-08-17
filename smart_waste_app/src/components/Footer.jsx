import { Box, Container, Stack, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        mt: "auto",
        color: "#e6fffb",
        background:
          "linear-gradient(135deg, rgba(10, 35, 52, 0.98) 0%, rgba(12, 74, 110, 0.95) 100%)",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          py: 3,
          px: { xs: 2, md: 4 },
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Smart Waste Management System
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(230,255,251,0.76)" }}>
              Cleaner routes, smarter bins, faster response.
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "rgba(230,255,251,0.72)" }}>
            Copyright 2026 Smart Waste Management System
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

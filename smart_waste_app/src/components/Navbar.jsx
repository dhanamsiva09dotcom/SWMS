import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Features", to: "/features" },
  { label: "About", to: "/about" },
  { label: "Login", to: "/login" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: "blur(18px)",
        background: "rgba(7, 30, 46, 0.82)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: 76,
          px: { xs: 2, md: 4 },
          gap: 2,
          justifyContent: "space-between",
        }}
      >
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "14px",
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(135deg, #34d399 0%, #22d3ee 100%)",
              color: "#06202f",
              boxShadow: "0 10px 22px rgba(34, 211, 238, 0.28)",
            }}
          >
            <DeleteSweepRoundedIcon />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 800, letterSpacing: 0.3, color: "#ffffff" }}
            >
              Smart Waste
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.68)" }}>
              Live city cleanliness platform
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, md: 1 } }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;

            return (
              <Button
                key={item.to}
                component={Link}
                to={item.to}
                sx={{
                  color: "#ffffff",
                  px: { xs: 1.2, md: 2 },
                  py: 1,
                  borderRadius: 99,
                  fontWeight: 700,
                  fontSize: { xs: "0.78rem", md: "0.92rem" },
                  backgroundColor: isActive ? "rgba(52, 211, 153, 0.18)" : "transparent",
                  border: isActive
                    ? "1px solid rgba(52, 211, 153, 0.36)"
                    : "1px solid transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

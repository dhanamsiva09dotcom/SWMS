import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Box, Chip, Container, Grid, Typography } from "@mui/material";
import LoginForm from "../components/LoginForm";

export default function Login() {
  const handleLogin = async ({ role, email, password }) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      localStorage.setItem("swmsUserRole", role);
      localStorage.setItem("swmsUserEmail", user.email || email);

      const dashboardPath =
        role === "admin" ? "/admin" : role === "driver" ? "/driver" : "/user";

      window.open(dashboardPath, "_blank", "noopener,noreferrer");
    } catch (error) {
      alert("Login failed. Check your email and password.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 140px)",
        display: "flex",
        alignItems: "center",
        background:
          "radial-gradient(circle at top right, rgba(250, 204, 21, 0.18), transparent 26%), linear-gradient(135deg, #0b2239 0%, #0f766e 100%)",
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="overline"
              sx={{ color: "#99f6e4", letterSpacing: 1.8, fontWeight: 700 }}
            >
              Secure Access
            </Typography>
            <Typography
              variant="h3"
              sx={{ color: "#f8fffd", fontWeight: 900, lineHeight: 1.1, mb: 2 }}
            >
              Sign in to manage bins, routes, and complaints.
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "rgba(248,255,253,0.8)", lineHeight: 1.9, maxWidth: 560 }}
            >
              Open your dashboard in a new tab and continue working with live Firebase data,
              route updates, and maintenance status changes.
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 3 }}>
              <Chip label="Admin workflow" sx={chipStyles} />
              <Chip label="Driver routing" sx={chipStyles} />
              <Chip label="User complaints" sx={chipStyles} />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                mx: "auto",
                maxWidth: 460,
                p: { xs: 3, md: 4 },
                borderRadius: 6,
                background: "rgba(255,255,255,0.96)",
                boxShadow: "0 28px 60px rgba(2, 12, 27, 0.28)",
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 900, mb: 1.5, color: "#0b2239" }}>
                Smart Waste Management
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, color: "#52667a" }}>
                Sign in with your email and password
              </Typography>
              <LoginForm onLogin={handleLogin} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

const chipStyles = {
  fontWeight: 700,
  color: "#f8fffd",
  backgroundColor: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.12)",
};

import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import { Box } from "@mui/material";

export default function App() {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Top Navbar */}
      <Navbar />

      {/* Page Content */}
      <Box flexGrow={1}>
        <AppRoutes />
      </Box>

      {/* Bottom Footer */}
      <Footer />
    </Box>
  );
}

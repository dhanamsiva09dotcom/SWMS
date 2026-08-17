import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Services from "../pages/Services";
import Features from "../pages/Features";
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import DriverDashboard from "../pages/DriverDashboard";
import UserDashboard from "../pages/UserDashboard";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/features" element={<Features />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/driver" element={<DriverDashboard />} />
            <Route path="/user" element={<UserDashboard />} />
        </Routes>
    );
}
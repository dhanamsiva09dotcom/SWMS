import { useState } from "react";
import { TextField, Button, MenuItem, Paper, Box, Typography } from "@mui/material";

export default function LoginForm({ onLogin }) {
    const [role, setRole] = useState("user");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin({ role, email, password });
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center">
            <Paper elevation={0} style={{ padding: "8px 0 0", width: "100%", boxShadow: "none" }}>
                <Typography variant="h5" gutterBottom style={{ textAlign: "center" }}>Login</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        select
                        label="Select Role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="driver">Driver</MenuItem>
                        <MenuItem value="user">User</MenuItem>
                    </TextField>

                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />

                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{ marginTop: "20px" }}
                    >
                        Login
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}

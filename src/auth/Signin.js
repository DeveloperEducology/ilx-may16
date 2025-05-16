import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Divider,
} from "@mui/material";
import "./login.css"; // Importing custom CSS

const Signin = () => {
  const { logIn, googleSignIn, user } = useUserAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  console.log(user);

  // Check if user is already logged in on component mount
  useEffect(() => {
    if (user) {
      navigate("/create");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await logIn(email, password);
      navigate("/create");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/create");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            variant="outlined"
            margin="normal"
            size="small"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            variant="outlined"
            margin="normal"
            size="small"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, py: 1.5, borderRadius: 1 }}
          >
            Log In
          </Button>
        </form>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link to="/signup" className="signup-link">
              Sign up
            </Link>
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }}>OR</Divider>
        {/* Uncomment and install react-google-button if needed */}
        {/* <GoogleButton className="google-btn" onClick={handleGoogleSignIn} /> */}
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          onClick={handleGoogleSignIn}
          sx={{ py: 1.5, borderRadius: 1 }}
        >
          Sign in with Google
        </Button>
      </Paper>
    </Container>
  );
};

export default Signin;

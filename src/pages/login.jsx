import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Button, TextField, Typography, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log(user);
      // Redirect to the shop or home page after successful login
      navigate('/home'); // Change this to the route you want to redirect to
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Box className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        {/* Logo or Store Name */}
        <Typography variant="h4" className="text-center text-blue-500 font-bold mb-6">
          Nuel's Store
        </Typography>

        {/* Email Input */}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputLabelProps={{ className: 'text-gray-500' }}
        />

        {/* Password Input */}
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{ className: 'text-gray-500' }}
        />

        {/* Login Button */}
        <Button
          onClick={handleLogin}
          variant="contained"
          color="primary"
          fullWidth
          className="mt-4 bg-blue-500"
        >
          Login
        </Button>

        {/* Link to Sign Up */}
        <Typography
          variant="body2"
          className="text-center mt-4 text-gray-600 hover:text-blue-500"
        >
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-500">Sign Up</Link>
        </Typography>
      </Box>
    </div>
  );
};

export default Login;

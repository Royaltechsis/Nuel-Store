import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase'; // Ensure you're importing db
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import { TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState(''); // New username state
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (username.trim() === '') {
      setError("Username is required");
      return;
    }

    if (email.trim() === '') {
      setError("Email is required");
      return;
    }

    if (password.trim() === '') {
      setError("Password is required");
      return;
    }

    if (confirmPassword.trim() === '') {
      setError("Please confirm your password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user data to Firestore with default role as "user"
      await setDoc(doc(db, 'users', user.uid), {
        username: username, // Include username
        email: user.email,
        role: 'user', // Set default role to "user"
        createdAt: new Date(),
      });

      // Redirect to login page after successful signup
      navigate('/login');
    } catch (error) {
      console.error('Error signing up:', error.message);
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Box className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <Typography variant="h4" className="text-center text-blue-500 font-bold mb-6">
          Sign Up
        </Typography>
        
        {error && <Typography variant="body2" color="error" className="mb-4">{error}</Typography>}

        <TextField
          label="Username" // New username field
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Confirm Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          className="mt-4"
          onClick={handleSignup}
        >
          Sign Up
        </Button>

        <Typography
          variant="body2"
          className="text-center mt-4 text-gray-600 hover:text-blue-500"
        >
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500">Login</Link>
        </Typography>
      </Box>
    </div>
  );
};

export default Signup;

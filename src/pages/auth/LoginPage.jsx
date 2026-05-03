import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Stack,
  Divider, // Import Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider, // Import GoogleAuthProvider
  GithubAuthProvider, // Import GithubAuthProvider
  signInWithPopup, // Import signInWithPopup
} from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // Import auth from firebaseConfig

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error',
  });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSnackbar({
        open: true,
        message: 'Login successful!',
        severity: 'success',
      });
      navigate('/admin/articles'); // Redirect to admin articles page on successful login
    } catch (error) {
      console.error('Login error:', error.message);
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setSnackbar({
        open: true,
        message: 'Google login successful!',
        severity: 'success',
      });
      navigate('/admin/articles');
    } catch (error) {
      console.error('Google login error:', error.message);
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      setSnackbar({
        open: true,
        message: 'GitHub login successful!',
        severity: 'success',
      });
      navigate('/admin/articles');
    } catch (error) {
      console.error('GitHub login error:', error.message);
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Admin Login
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
          Sign in to manage articles.
        </Typography>
        <form onSubmit={handleLogin}>
          <Stack spacing={3}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? 'Logging In...' : 'Login with Email'}
            </Button>
          </Stack>
        </form>

        <Divider sx={{ my: 3 }}>OR</Divider> {/* Added Divider */}

        <Stack spacing={2}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleGoogleLogin}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" />}
          >
            Login with Google
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleGithubLogin}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <img src="https://img.icons8.com/ios-glyphs/16/000000/github.png" alt="GitHub" />}
          >
            Login with GitHub
          </Button>
        </Stack>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginPage;
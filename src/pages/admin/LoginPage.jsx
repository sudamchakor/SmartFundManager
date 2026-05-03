import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Stack,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword, // Keep for email/password login
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../../firebaseConfig';

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

  // Handle traditional email/password login
  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSnackbar({
        open: true,
        message: 'Login successful!',
        severity: 'success',
      });
      navigate('/admin/articles');
    } catch (error) {
      console.error('Email/Password login error:', error.message);
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Generic handler for social logins
  const handleSocialLogin = async (providerInstance, providerName) => {
    setLoading(true);
    try {
      await signInWithPopup(auth, providerInstance);
      setSnackbar({
        open: true,
        message: `${providerName} login successful!`,
        severity: 'success',
      });
      navigate('/admin/articles');
    } catch (error) {
      console.error(`${providerName} login error:`, error.message);
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    handleSocialLogin(provider, 'Google');
  };

  const handleGithubLogin = () => {
    const provider = new GithubAuthProvider();
    handleSocialLogin(provider, 'GitHub');
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Admin Login
        </Typography>
        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Sign in to manage articles.
        </Typography>

        {/* Email/Password Login Form */}
        <form onSubmit={handleEmailPasswordLogin}>
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
              startIcon={
                loading && <CircularProgress size={20} color="inherit" />
              }
            >
              {loading ? 'Logging In...' : 'Login with Email'}
            </Button>
          </Stack>
        </form>

        <Divider sx={{ my: 3 }}>OR</Divider>

        {/* Social Login Buttons */}
        <Stack spacing={2}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleGoogleLogin}
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <img
                  src="https://img.icons8.com/color/16/000000/google-logo.png"
                  alt="Google"
                />
              )
            }
          >
            Login with Google
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleGithubLogin}
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <img
                  src="https://img.icons8.com/ios-glyphs/16/000000/github.png"
                  alt="GitHub"
                />
              )
            }
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
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginPage;

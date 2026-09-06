import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import authService from '../services/auth';

const RegisterContainer = styled(Box)(() => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #7c3aed 100%)',
  padding: '16px',
}));

const RegisterCard = styled(Card)(() => ({
  maxWidth: 420,
  width: '100%',
  borderRadius: '16px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

const CardContent = styled(Box)(() => ({
  padding: '32px',
}));

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authService.register({ username, email, password });
      navigate('/login');
    } catch (registrationError) {
      setError(
        registrationError instanceof Error
          ? registrationError.message
          : 'Failed to register',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937', textAlign: 'center' }}>
            Create your account
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', mt: 1, mb: 3, textAlign: 'center' }}>
            Join ShopHub today
          </Typography>

          <form onSubmit={handleSubmit}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              margin="normal"
              required
              disabled={loading}
              autoFocus
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              margin="normal"
              required
              disabled={loading}
              inputProps={{ minLength: 6 }}
            />
            <TextField
              fullWidth
              label="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              margin="normal"
              required
              disabled={loading}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
              sx={{ mt: 3, py: 1.5, textTransform: 'none', borderRadius: '8px' }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <Typography sx={{ mt: 3, textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" sx={{ color: '#2563eb', fontWeight: 600 }}>
              Sign in
            </Link>
          </Typography>
        </CardContent>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;

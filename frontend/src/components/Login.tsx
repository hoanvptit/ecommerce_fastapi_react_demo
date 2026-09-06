import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Alert,
  FormControlLabel,
  Checkbox,
  Link,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth } from '../hooks/useAuth';

const LoginContainer = styled(Box)(() => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #7c3aed 100%)',
  padding: '16px',
}));

const LoginCard = styled(Card)(() => ({
  maxWidth: 420,
  width: '100%',
  borderRadius: '16px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

const CardContent = styled(Box)(() => ({
  padding: '32px',
}));

const LogoBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '24px',
}));

const LogoCircle = styled(Box)(() => ({
  width: 64,
  height: 64,
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '32px',
  marginBottom: '16px',
  boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)',
}));

const StyledTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#f9fafb',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#f3f4f6',
    },
    '&.Mui-focused': {
      backgroundColor: 'white',
      boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
    },
  },
}));

const LoginButton = styled(Button)(() => ({
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 600,
  padding: '12px',
  borderRadius: '8px',
  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
  boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 25px rgba(37, 99, 235, 0.5)',
    transform: 'translateY(-2px)',
  },
  '&:disabled': {
    background: '#d1d5db',
    boxShadow: 'none',
  },
}));

const DividerBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  margin: '24px 0',
  '&::before, &::after': {
    content: '""',
    flex: 1,
    height: '1px',
    backgroundColor: '#e5e7eb',
  },
}));

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <CardContent>
          <LogoBox>
            <LogoCircle>🛍️</LogoCircle>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#1f2937',
                fontSize: '24px',
              }}
            >
              Shop Mall
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#6b7280',
                marginTop: '8px',
              }}
            >
              Welcome back to your store
            </Typography>
          </LogoBox>

          <form onSubmit={handleSubmit}>
            {error && (
              <Alert
                severity="error"
                sx={{
                  marginBottom: 2,
                  borderRadius: '8px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#dc2626',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              >
                {error}
              </Alert>
            )}

            <StyledTextField
              fullWidth
              label="Username or Email"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              disabled={loading}
              required
              autoFocus
              InputLabelProps={{
                sx: {
                  color: '#9ca3af',
                  '&.Mui-focused': {
                    color: '#2563eb',
                  },
                },
              }}
            />

            <StyledTextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              disabled={loading}
              required
              InputLabelProps={{
                sx: {
                  color: '#9ca3af',
                  '&.Mui-focused': {
                    color: '#2563eb',
                  },
                },
              }}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 2,
                marginBottom: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                    sx={{
                      color: '#d1d5db',
                      '&.Mui-checked': {
                        color: '#2563eb',
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: '14px', color: '#6b7280' }}>
                    Remember me
                  </Typography>
                }
              />
              <Link
                component={RouterLink}
                to="/register"
                sx={{
                  fontSize: '14px',
                  color: '#2563eb',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline',
                    color: '#1d4ed8',
                  },
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <LoginButton
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                  Signing in...
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <LockIcon fontSize="small" />
                  Sign In
                </Box>
              )}
            </LoginButton>
          </form>

          <DividerBox>
            <Typography sx={{ color: '#9ca3af', fontSize: '13px', fontWeight: 500 }}>
              OR
            </Typography>
          </DividerBox>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 2,
              marginBottom: 3,
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              sx={{
                borderColor: '#e5e7eb',
                color: '#6b7280',
                textTransform: 'none',
                fontSize: '14px',
                borderRadius: '8px',
                fontWeight: 500,
                '&:hover': {
                  borderColor: '#9ca3af',
                  backgroundColor: '#f9fafb',
                },
              }}
              disabled={loading}
            >
              Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                borderColor: '#e5e7eb',
                color: '#6b7280',
                textTransform: 'none',
                fontSize: '14px',
                borderRadius: '8px',
                fontWeight: 500,
                '&:hover': {
                  borderColor: '#9ca3af',
                  backgroundColor: '#f9fafb',
                },
              }}
              disabled={loading}
            >
              GitHub
            </Button>
          </Box>

          <Typography
            sx={{
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '14px',
            }}
          >
            Don't have an account?{' '}
            <Link
              href="/register"
              sx={{
                color: '#2563eb',
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Sign up
            </Link>
          </Typography>
        </CardContent>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
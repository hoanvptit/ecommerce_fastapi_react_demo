import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container, AppBar, Toolbar, Typography, Button, Menu, MenuItem, InputAdornment, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import { ProductList } from './components/ProductList';
import { CategoryList } from './components/CategoryList';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Login from './components/Login';
import Register from './components/Register';
import ProductTable from './components/ProductTable';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <Typography>Loading...</Typography>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const StyledAppBar = styled(AppBar)(() => ({
  background: `linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)`,
  boxShadow: '0 4px 20px rgba(37, 99, 235, 0.15)',
  borderBottom: 'none',
}));

const StyledToolbar = styled(Toolbar)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 24px',
}));

const LogoSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const SearchBox = styled(TextField)(() => ({
  width: '300px',
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'white',
    },
    '&.Mui-focused': {
      backgroundColor: 'white',
      boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.2)',
    },
  },
}));

const MainContent = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '24px',
  '@media (min-width: 960px)': {
    gridTemplateColumns: '280px 1fr',
  },
}));

const PageContainer = styled(Box)({
  flex: 1,
  backgroundColor: '#f9fafb',
  paddingTop: '24px',
  paddingBottom: '40px',
});

function AppContent() {
  const { logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <StyledAppBar position="sticky">
        <StyledToolbar>
          <LogoSection>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
              }}
            >
              🛍️
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'white',
                fontSize: '20px',
                letterSpacing: '-0.5px',
              }}
            >
              ShopHub
            </Typography>
          </LogoSection>

          <SearchBox
            placeholder="Search products..."
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#6b7280' }} />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              sx={{
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textTransform: 'none',
                fontSize: '15px',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ShoppingCartIcon />
              Cart
            </Button>

            <Button
              onClick={handleMenuOpen}
              sx={{
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textTransform: 'none',
                fontSize: '15px',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <AccountCircleIcon />
              {typeof user === 'string' ? user : 'Account'}
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  mt: 1,
                },
              }}
            >
              <MenuItem disabled sx={{ color: '#6b7280', fontSize: '12px' }}>
                {typeof user === 'string' ? user : 'User'}
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: '#dc2626' }}>
                <LogoutIcon sx={{ mr: 1, fontSize: '18px' }} />
                Sign Out
              </MenuItem>
            </Menu>
          </Box>
        </StyledToolbar>
      </StyledAppBar>

      <PageContainer>
        <Container maxWidth="lg">
          <MainContent>
            <Box>
              <CategoryList />
            </Box>
            <Box>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <ProductList />
                  </ProtectedRoute>
                } />
                <Route path="/category/:categoryId" element={
                  <ProtectedRoute>
                    <ProductList categoryId={Number(window.location.pathname.split('/')[2])} />
                  </ProtectedRoute>
                } />
                <Route path="/products/table" element={
                  <ProtectedRoute>
                    <ProductTable />
                  </ProtectedRoute>
                } />
              </Routes>
            </Box>
          </MainContent>
        </Container>
      </PageContainer>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
<<<<<<< HEAD
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                E-Commerce Store
              </Typography>
            </Toolbar>
          </AppBar>
          <Container sx={{ mt: 3 }}>
            <MainContent>
              <Box>
                <CategoryList />
              </Box>
              <Box>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  <Route path="/" element={
                    <ProtectedRoute>
                      <ProductList />
                    </ProtectedRoute>
                  } />
                  <Route path="/category/:categoryId" element={
                    <ProtectedRoute>
                      <ProductList categoryId={Number(window.location.pathname.split('/')[2])} />
                    </ProtectedRoute>
                  } />
                  <Route path="/products/table" element={
                    <ProtectedRoute>
                      <ProductTable />
                    </ProtectedRoute>
                  } />
                </Routes>
              </Box>
            </MainContent>
          </Container>
        </Box>
=======
        <AppContent />
>>>>>>> 54c4a007dde8fbf622804474b09653c93b2812b0
      </Router>
    </AuthProvider>
  );
}

export default App;

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Container, Grid, AppBar, Toolbar, Typography } from '@mui/material';
import { ProductList } from './components/ProductList';
import { CategoryList } from './components/CategoryList';

function App() {
  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              E-Commerce Store
            </Typography>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <CategoryList />
            </Grid>
            <Grid item xs={12} md={9}>
              <Routes>
                <Route path="/" element={<ProductList />} />
                <Route path="/category/:categoryId" element={
                  <ProductList categoryId={Number(window.location.pathname.split('/')[2])} />
                } />
              </Routes>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Router>
  );
}

export default App;

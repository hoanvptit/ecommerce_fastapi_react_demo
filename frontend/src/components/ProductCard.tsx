import { Card, CardContent, CardActions, Typography, Button, Box, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Product } from '../types';
import { useState } from 'react';

interface ProductCardProps {
    product: Product;
}

const StyledCard = styled(Card)(() => ({
  minWidth: 275,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '1px solid #e5e7eb',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-8px)',
    borderColor: '#2563eb',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '3px',
    background: 'linear-gradient(90deg, #2563eb, #60a5fa)',
    transition: 'left 0.3s ease',
  },
  '&:hover::before': {
    left: '100%',
  },
}));

const PriceBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'baseline',
  gap: '8px',
  marginTop: '8px',
}));

const PriceTag = styled(Typography)(() => ({
  fontSize: '24px',
  fontWeight: 700,
  color: '#2563eb',
}));

const OriginalPrice = styled(Typography)(() => ({
  fontSize: '14px',
  color: '#9ca3af',
  textDecoration: 'line-through',
}));

const BadgeBox = styled(Box)(() => ({
  position: 'absolute',
  top: '16px',
  right: '16px',
  display: 'flex',
  gap: '4px',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  zIndex: 10,
}));

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const isSale = product.price < 50; // Arbitrary sale logic

  return (
    <StyledCard>
      <BadgeBox>
        {isSale && (
          <Chip
            label="Sale"
            size="small"
            sx={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              fontWeight: 600,
              fontSize: '12px',
            }}
          />
        )}
        <Chip
          label="New"
          size="small"
          sx={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            fontWeight: 600,
            fontSize: '12px',
          }}
        />
      </BadgeBox>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 600,
            fontSize: '16px',
            color: '#1f2937',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 1,
          }}
        >
          {product.name}
        </Typography>

        <PriceBox>
          <PriceTag>${product.price.toFixed(2)}</PriceTag>
          {isSale && (
            <OriginalPrice>
              ${(product.price * 1.2).toFixed(2)}
            </OriginalPrice>
          )}
        </PriceBox>

        <Box sx={{ display: 'flex', gap: 0.5, my: 1 }}>
          {[...Array(5)].map((_, i) => (
            <span key={i} style={{ color: i < 4 ? '#fbbf24' : '#d1d5db', fontSize: '14px' }}>
              ★
            </span>
          ))}
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: '#6b7280',
            fontSize: '13px',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.description || 'No description provided'}
        </Typography>
      </CardContent>

      <CardActions sx={{ pt: 0, gap: 1, justifyContent: 'space-between', p: 2 }}>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddShoppingCartIcon />}
          sx={{
            flex: 1,
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '6px',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          Add to Cart
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setIsFavorite(!isFavorite)}
          sx={{
            minWidth: 'auto',
            borderColor: isFavorite ? '#ef4444' : '#d1d5db',
            color: isFavorite ? '#ef4444' : '#9ca3af',
            '&:hover': {
              borderColor: '#ef4444',
              color: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.04)',
            },
          }}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </Button>
      </CardActions>
    </StyledCard>
  );
};
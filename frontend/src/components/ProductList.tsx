import { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField,
    Typography,
    Box,
    CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { Category, Product } from '../types';
import {
    createProduct,
    getCategories,
    getProducts,
    getProductsByCategory,
} from '../services/api';
import { ProductCard } from './ProductCard';

interface ProductListProps {
    categoryId?: number;
}

const emptyForm = {
    name: '',
    price: '',
    category_id: '',
};

const PageTitle = styled(Box)(() => ({
  marginBottom: '32px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '16px',
}));

const AddButton = styled(Button)(() => ({
  textTransform: 'none',
  fontSize: '15px',
  fontWeight: 600,
  padding: '8px 16px',
  borderRadius: '8px',
  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
  boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 25px rgba(37, 99, 235, 0.4)',
    transform: 'translateY(-2px)',
  },
}));

const EmptyState = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '64px 16px',
  textAlign: 'center',
  borderRadius: '12px',
  backgroundColor: '#f9fafb',
  border: '2px dashed #e5e7eb',
}));

const StyledDialog = styled(Dialog)(() => ({
  '& .MuiDialogContent-root': {
    paddingTop: '16px',
  },
}));

const StyledTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#f9fafb',
    },
    '&.Mui-focused': {
      backgroundColor: 'white',
      boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
    },
  },
}));

const DialogTitle_ = styled(DialogTitle)(() => ({
  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
  color: 'white',
  fontWeight: 700,
  fontSize: '20px',
}));

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '400px',
  flexDirection: 'column',
  gap: '16px',
});

export const ProductList = ({ categoryId }: ProductListProps) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [formData, setFormData] = useState(emptyForm);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const loadProducts = useCallback(async () => {
        try {
            const data = categoryId
                ? await getProductsByCategory(categoryId)
                : await getProducts();
            setProducts(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    }, [categoryId]);

    useEffect(() => {
        void loadProducts();
    }, [loadProducts]);

    useEffect(() => {
        const fetchCategories = async () => {
            if (!isAddDialogOpen) {
                return;
            }

            try {
                const data = await getCategories();
                setCategories(data);
            } catch (err) {
                setCategories([]);
            }
        };

        void fetchCategories();
    }, [isAddDialogOpen]);

    const handleFieldChange = (field: keyof typeof emptyForm, value: string) => {
        setFormData((current) => ({ ...current, [field]: value }));
    };

    const handleAddProduct = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitError(null);

        const trimmedName = formData.name.trim();
        const priceValue = Number(formData.price);

        if (!trimmedName || !formData.category_id || Number.isNaN(priceValue) || priceValue <= 0) {
            setSubmitError('Please enter a valid product name, price, and category.');
            return;
        }

        try {
            setSubmitting(true);
            await createProduct({
                name: trimmedName,
                price: priceValue,
                category_id: Number(formData.category_id),
            });
            setFormData(emptyForm);
            setIsAddDialogOpen(false);
            await loadProducts();
        } catch (err) {
            setSubmitError(
                err instanceof Error ? err.message : 'Failed to create product.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
      return (
        <LoadingContainer>
          <CircularProgress sx={{ color: '#2563eb' }} />
          <Typography sx={{ color: '#6b7280' }}>Loading products...</Typography>
        </LoadingContainer>
      );
    }

    if (error) {
      return (
        <Container>
          <Alert
            severity="error"
            sx={{
              borderRadius: '8px',
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
            }}
          >
            {error}
          </Alert>
        </Container>
      );
    }

    return (
        <Container maxWidth="lg">
            <PageTitle>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#1f2937',
                    mb: 0.5,
                  }}
                >
                  {categoryId ? 'Category Products' : 'All Products'}
                </Typography>
                <Typography sx={{ color: '#6b7280', fontSize: '14px' }}>
                  {products.length} {products.length === 1 ? 'product' : 'products'} available
                </Typography>
              </Box>
              <AddButton
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsAddDialogOpen(true)}
              >
                Add Product
              </AddButton>
            </PageTitle>

            {products.length === 0 ? (
              <EmptyState>
                <Typography variant="h6" sx={{ color: '#6b7280', mb: 1 }}>
                  No products found
                </Typography>
                <Typography sx={{ color: '#9ca3af', fontSize: '14px' }}>
                  Try a different category or add a new product
                </Typography>
              </EmptyState>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  gap: 3,
                }}
              >
                  {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                  ))}
              </Box>
            )}

            <StyledDialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle_>Add New Product</DialogTitle_>
                <form onSubmit={handleAddProduct}>
                    <DialogContent>
                        <StyledTextField
                            label="Product name"
                            value={formData.name}
                            onChange={(event) => handleFieldChange('name', event.target.value)}
                            fullWidth
                            margin="normal"
                            required
                            disabled={submitting}
                            InputLabelProps={{
                              sx: {
                                '&.Mui-focused': {
                                  color: '#2563eb',
                                },
                              },
                            }}
                        />
                        <StyledTextField
                            label="Price ($)"
                            type="number"
                            inputProps={{ min: '0', step: '0.01' }}
                            value={formData.price}
                            onChange={(event) => handleFieldChange('price', event.target.value)}
                            fullWidth
                            margin="normal"
                            required
                            disabled={submitting}
                            InputLabelProps={{
                              sx: {
                                '&.Mui-focused': {
                                  color: '#2563eb',
                                },
                              },
                            }}
                        />
                        <StyledTextField
                            select
                            label="Category"
                            value={formData.category_id}
                            onChange={(event) => handleFieldChange('category_id', event.target.value)}
                            fullWidth
                            margin="normal"
                            required
                            disabled={submitting}
                            InputLabelProps={{
                              sx: {
                                '&.Mui-focused': {
                                  color: '#2563eb',
                                },
                              },
                            }}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </StyledTextField>
                        {submitError && (
                            <Alert
                              severity="error"
                              sx={{
                                mt: 2,
                                borderRadius: '8px',
                                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                                border: '1px solid rgba(220, 38, 38, 0.3)',
                              }}
                            >
                                {submitError}
                            </Alert>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 2, gap: 1 }}>
                        <Button
                          onClick={() => setIsAddDialogOpen(false)}
                          sx={{
                            color: '#6b7280',
                            textTransform: 'none',
                            fontWeight: 500,
                          }}
                          disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={submitting}
                          sx={{
                            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: '6px',
                          }}
                        >
                            {submitting ? (
                              <>
                                <CircularProgress size={16} sx={{ mr: 1, color: 'white' }} />
                                Saving...
                              </>
                            ) : (
                              'Save Product'
                            )}
                        </Button>
                    </DialogActions>
                </form>
            </StyledDialog>
        </Container>
    );
};
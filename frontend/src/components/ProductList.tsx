import { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
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

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setIsAddDialogOpen(true)}
                sx={{ mb: 2 }}
            >
                Add Product
            </Button>

            <Grid container spacing={2}>
                {products.map((product) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>

            <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add Product</DialogTitle>
                <form onSubmit={handleAddProduct}>
                    <DialogContent>
                        <TextField
                            label="Product name"
                            value={formData.name}
                            onChange={(event) => handleFieldChange('name', event.target.value)}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Price"
                            type="number"
                            inputProps={{ min: '0', step: '0.01' }}
                            value={formData.price}
                            onChange={(event) => handleFieldChange('price', event.target.value)}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            select
                            label="Category"
                            value={formData.category_id}
                            onChange={(event) => handleFieldChange('category_id', event.target.value)}
                            fullWidth
                            margin="normal"
                            required
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        {submitError && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {submitError}
                            </Alert>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsAddDialogOpen(false)} color="inherit">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" disabled={submitting}>
                            {submitting ? 'Saving...' : 'Save Product'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Container>
    );
};
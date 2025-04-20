import { useEffect, useState } from 'react';
import { Grid, Container, Typography } from '@mui/material';
import { Product } from '../types';
import { getProducts, getProductsByCategory } from '../services/api';
import { ProductCard } from './ProductCard';

interface ProductListProps {
    categoryId?: number;
}

export const ProductList = ({ categoryId }: ProductListProps) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = categoryId 
                    ? await getProductsByCategory(categoryId)
                    : await getProducts();
                setProducts(data);
            } catch (err) {
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId]);

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container>
            <Grid container spacing={2}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};
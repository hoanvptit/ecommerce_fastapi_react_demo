import { Card, CardContent, Typography } from '@mui/material';
import { Product } from '../types';

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <Card sx={{ minWidth: 275, margin: 1 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {product.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    ${product.price}
                </Typography>
                <Typography variant="body2">
                    {product.description}
                </Typography>
            </CardContent>
        </Card>
    );
};
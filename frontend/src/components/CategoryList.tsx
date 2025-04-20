import { useEffect, useState } from 'react';
import { List, ListItem, ListItemButton, ListItemText, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Category } from '../types';
import { getCategories } from '../services/api';

export const CategoryList = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (err) {
                setError('Failed to fetch categories');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Paper elevation={2}>
            <List>
                <ListItem>
                    <ListItemButton onClick={() => navigate('/')}>
                        <ListItemText primary="All Products" />
                    </ListItemButton>
                </ListItem>
                {categories.map((category) => (
                    <ListItem key={category.id}>
                        <ListItemButton onClick={() => navigate(`/category/${category.id}`)}>
                            <ListItemText 
                                primary={category.name}
                                secondary={category.description}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};
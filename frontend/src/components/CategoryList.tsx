import { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { Category } from '../types';
import { createCategory, getCategories } from '../services/api';

export const CategoryList = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const loadCategories = useCallback(async () => {
        try {
            const data = await getCategories();
            setCategories(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadCategories();
    }, [loadCategories]);

    const handleAddCategory = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitError(null);

        const trimmedName = categoryName.trim();

        if (!trimmedName) {
            setSubmitError('Please enter a category name.');
            return;
        }

        try {
            setSubmitting(true);
            await createCategory({ name: trimmedName });
            setCategoryName('');
            setIsAddDialogOpen(false);
            await loadCategories();
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'Failed to create category.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Paper elevation={2}>
            <List>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ListItemText
                        primary={
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                Categories
                            </Typography>
                        }
                    />
                    <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => setIsAddDialogOpen(true)}
                        variant="outlined"
                    >
                        Add
                    </Button>
                </ListItem>

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

            <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add Category</DialogTitle>
                <form onSubmit={handleAddCategory}>
                    <DialogContent>
                        <TextField
                            label="Category name"
                            value={categoryName}
                            onChange={(event) => setCategoryName(event.target.value)}
                            fullWidth
                            margin="normal"
                            required
                            autoFocus
                        />
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
                            {submitting ? 'Saving...' : 'Save Category'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Paper>
    );
};
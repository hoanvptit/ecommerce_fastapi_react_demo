import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import GridViewIcon from '@mui/icons-material/GridView';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { Category } from '../types';
import { createCategory, getCategories } from '../services/api';

const StyledPaper = styled(Paper)(() => ({
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
}));

const SidebarHeader = styled(Box)(() => ({
  padding: '16px',
  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}));

const StyledListItemButton = styled(ListItemButton)(() => ({
  transition: 'all 0.3s ease',
  borderLeft: '3px solid transparent',
  paddingLeft: '16px',
  '&:hover': {
    backgroundColor: 'rgba(37, 99, 235, 0.05)',
    borderLeftColor: '#2563eb',
    paddingLeft: '24px',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    borderLeftColor: '#2563eb',
    '& .MuiListItemText-primary': {
      color: '#2563eb',
      fontWeight: 600,
    },
  },
}));

export const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [addError, setAddError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
      setError(null);
    } catch {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (event: FormEvent) => {
    event.preventDefault();
    const name = categoryName.trim();
    if (!name) {
      setAddError('Category name is required');
      return;
    }

    setAdding(true);
    setAddError(null);
    try {
      const category = await createCategory(name);
      setCategories((currentCategories) => [...currentCategories, category]);
      setCategoryName('');
      setAddDialogOpen(false);
    } catch (addCategoryError) {
      setAddError(
        addCategoryError instanceof Error ? addCategoryError.message : 'Failed to add category',
      );
    } finally {
      setAdding(false);
    }
  };

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    if (categoryId === null) {
      navigate('/');
    } else {
      navigate(`/category/${categoryId}`);
    }
  };

  if (error) {
    return (
      <StyledPaper>
        <SidebarHeader>
          <GridViewIcon />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '16px' }}>
            Categories
          </Typography>
          <Button
            size="small"
            variant="contained"
            onClick={() => {
              setAddError(null);
              setAddDialogOpen(true);
            }}
            sx={{ ml: 'auto', minWidth: 0, color: 'white', borderColor: 'rgba(255,255,255,.6)' }}
          >
            Add
          </Button>
        </SidebarHeader>
        <Box sx={{ p: 2 }}>
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        </Box>
      </StyledPaper>
    );
  }

  return (
    <StyledPaper>
      <SidebarHeader>
        <GridViewIcon />
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '16px' }}>
          Categories
        </Typography>
        <Button
          size="small"
          variant="contained"
          onClick={() => {
            setAddError(null);
            setAddDialogOpen(true);
          }}
          sx={{ ml: 'auto', minWidth: 0, color: 'white', borderColor: 'rgba(255,255,255,.6)' }}
        >
          Add
        </Button>
      </SidebarHeader>
      <List sx={{ p: 0 }}>
        <ListItem disablePadding>
          <StyledListItemButton
            selected={selectedCategory === null}
            onClick={() => handleCategoryClick(null)}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                marginRight: '12px',
                fontSize: '18px',
              }}
            >
              🛍️
            </Box>
            <ListItemText
              primary="All Products"
              primaryTypographyProps={{
                sx: { fontWeight: 500, fontSize: '15px' },
              }}
            />
          </StyledListItemButton>
        </ListItem>

        {loading ? (
          [...Array(3)].map((_, i) => (
            <ListItem key={i} disablePadding>
              <Box sx={{ width: '100%', p: 2 }}>
                <Skeleton width="80%" />
                <Skeleton width="60%" />
              </Box>
            </ListItem>
          ))
        ) : categories.length > 0 ? (
          categories.map((category, index) => (
            <ListItem key={category.id} disablePadding>
              <StyledListItemButton
                selected={selectedCategory === category.id}
                onClick={() => handleCategoryClick(category.id)}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    background: `linear-gradient(135deg, hsl(${(index * 60) % 360}, 70%, 60%), hsl(${(index * 60) % 360}, 70%, 50%))`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    marginRight: '12px',
                    fontSize: '16px',
                  }}
                >
                  {['📱', '👕', '⌚', '👗', '👜', '👟'][index % 6]}
                </Box>
                <ListItemText
                  primary={category.name}
                  secondary={category.description}
                  primaryTypographyProps={{
                    sx: { fontWeight: 500, fontSize: '15px' },
                  }}
                  secondaryTypographyProps={{
                    sx: { fontSize: '12px', lineHeight: 1.3 },
                  }}
                />
              </StyledListItemButton>
            </ListItem>
          ))
        ) : (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              No categories yet. Add a category before creating products.
            </Typography>
          </Box>
        )}
      </List>

      {categories.length > 0 && !loading && (
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Chip
            icon={<LocalOfferIcon />}
            label="Trending"
            size="small"
            sx={{
              background: 'rgba(249, 115, 22, 0.1)',
              color: '#f97316',
              fontWeight: 600,
            }}
          />
          <Chip
            label="Sale"
            size="small"
            sx={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              fontWeight: 600,
            }}
          />
        </Box>
      )}

      <Dialog
        open={addDialogOpen}
        onClose={() => !adding && setAddDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <Box component="form" onSubmit={handleAddCategory}>
          <DialogTitle>Add category</DialogTitle>
          <DialogContent>
            {addError && <Alert severity="error" sx={{ mb: 2 }}>{addError}</Alert>}
            <TextField
              autoFocus
              fullWidth
              required
              label="Category name"
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
              disabled={adding}
              inputProps={{ maxLength: 50 }}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddDialogOpen(false)} disabled={adding}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={adding}>
              {adding ? 'Adding...' : 'Add category'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </StyledPaper>
  );
};
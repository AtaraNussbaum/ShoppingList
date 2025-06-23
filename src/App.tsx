import React, { useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Fab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ShoppingCart,
  Add,
  Category,
  Receipt
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchCategories } from './store/thunks/categoriesThunks';
import ShoppingList from './components/ShoppingList';
import AddItemForm from './components/AddItemForm';
import ItemsList from './components/ItemsList';
import { colors } from './styles/theme';
import './App.css';

const App: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  
  const { totalItems, isLoading } = useAppSelector(state => state.shoppingList);
  const { categories } = useAppSelector(state => state.categories);

  useEffect(() => {
    // טעינת קטגוריות בהפעלה
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <Box className="app-container">
      {/* Header */}
      <AppBar position="sticky" className="app-header">
        <Toolbar>
          <Box display="flex" alignItems="center" gap={2}>
            <ShoppingCart sx={{ fontSize: 28 }} />
            <Typography variant="h6" component="h1" className="gradient-text">
              רשימת קניות חכמה
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton color="inherit">
              <Badge badgeContent={categories.length} color="secondary">
                <Category />
              </Badge>
            </IconButton>
            
            <IconButton color="inherit">
              <Badge badgeContent={totalItems} color="secondary">
                <Receipt />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" className="main-container">
        <Box className="content-wrapper">
          {/* Hero Section */}
          <Box className="hero-section slide-up">
            <Typography variant="h4" component="h2" className="hero-title">
              ברוכים הבאים לרשימת הקניות החכמה
            </Typography>
            <Typography variant="body1" className="hero-subtitle">
              נהלו את הקניות שלכם בקלות ויעילות
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Box className="stats-container fade-in">
            <Box className="stat-card">
              <Box className="stat-icon primary">
                <ShoppingCart />
              </Box>
              <Box>
                <Typography variant="h6" className="stat-number">
                  {totalItems}
                </Typography>
                <Typography variant="body2" className="stat-label">
                  פריטים בסל
                </Typography>
              </Box>
            </Box>

            <Box className="stat-card">
              <Box className="stat-icon secondary">
                <Category />
              </Box>
              <Box>
                <Typography variant="h6" className="stat-number">
                  {categories.length}
                </Typography>
                <Typography variant="body2" className="stat-label">
                  קטגוריות זמינות
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Main Grid */}
          <Box className="main-grid">
            {/* Add Item Form */}
            <Box className="form-section">
              <AddItemForm />
            </Box>

            {/* Items List */}
            <Box className="list-section">
              <ItemsList />
            </Box>
          </Box>

          {/* Shopping List Actions */}
          <Box className="actions-section">
            <ShoppingList />
          </Box>
        </Box>
      </Container>

      {/* Floating Action Button */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          className="fab-add"
          onClick={() => {
            // Scroll to add form
            document.querySelector('.form-section')?.scrollIntoView({ 
              behavior: 'smooth' 
            });
          }}
        >
          <Add />
        </Fab>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <Box className="loading-overlay">
          <Box className="loading-spinner">
            <ShoppingCart className="spinning-icon" />
            <Typography variant="body1" sx={{ mt: 2, color: colors.text.secondary }}>
              טוען...
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default App;

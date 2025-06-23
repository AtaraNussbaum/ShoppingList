import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  IconButton,
  Card,
  CardContent
} from '@mui/material';
import {
  ShoppingCart,
  Category as CategoryIcon,
  Close,
  Info
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import AddItemForm from './AddItemForm';
import ItemsList from './ItemsList';
import QuickActions from './QuickActions';
import './ShoppingList.css';

const ShoppingList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, totalItems, error } = useAppSelector(state => state.shoppingList);
  const { categories } = useAppSelector(state => state.categories);
  
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  const getListSummary = () => {
    const categoriesCount = new Set(items.map(item => item.categoryId)).size;
    return {
      totalItems,
      categoriesCount,
      hasItems: items.length > 0
    };
  };

  const summary = getListSummary();

  return (
    <Container maxWidth="xl" className="shopping-list-container">
      {/* Hero Section */}
      <Box className="hero-section">
        <Box className="hero-content">
          <Box className="hero-icon">
            <ShoppingCart />
          </Box>
          <Box className="hero-text">
            <Typography variant="h4" className="hero-title">
              מערכת רשימות קניות חכמה
            </Typography>
            <Typography variant="subtitle1" className="hero-subtitle">
              נהל את רשימת הקניות שלך בקלות ויעילות
            </Typography>
          </Box>
          <IconButton onClick={() => setShowInfoDialog(true)} className="info-button">
            <Info />
          </IconButton>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box className="summary-section">
        <Card className="summary-card primary">
          <Box className="summary-content">
            <ShoppingCart className="summary-icon" />
            <Box>
              <Typography variant="h4" className="summary-number">
                {summary.totalItems}
              </Typography>
              <Typography variant="body2" className="summary-label">
                פריטים ברשימה
              </Typography>
            </Box>
          </Box>
        </Card>
        
        <Card className="summary-card secondary">
          <Box className="summary-content">
            <CategoryIcon className="summary-icon" />
            <Box>
              <Typography variant="h4" className="summary-number">
                {summary.categoriesCount}
              </Typography>
              <Typography variant="body2" className="summary-label">
                קטגוריות שונות
              </Typography>
            </Box>
          </Box>
        </Card>
        
        <Card className="summary-card success">
          <Box className="summary-content">
            <CategoryIcon className="summary-icon" />
            <Box>
              <Typography variant="h4" className="summary-number">
                {categories.length}
              </Typography>
              <Typography variant="body2" className="summary-label">
                קטגוריות זמינות
              </Typography>
            </Box>
          </Box>
        </Card>
      </Box>

      {/* Main Content */}
      <Box className="main-content">
        {/* Add Item Form */}
        <Box className="form-section">
          <AddItemForm />
        </Box>

        {/* Items List */}
        <Box className="list-section">
          <ItemsList />
        </Box>
      </Box>

      {/* Quick Actions */}
      <QuickActions />

      {/* Info Dialog */}
      <Dialog
        open={showInfoDialog}
        onClose={() => setShowInfoDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <Info />
              אודות המערכת
            </Box>
            <IconButton onClick={() => setShowInfoDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box className="info-content">
            <Typography variant="h6" gutterBottom>
              מערכת רשימות קניות חכמה
            </Typography>
            <Typography variant="body1" paragraph>
              מערכת מתקדמת לניהול רשימות קניות עם יכולות של:
            </Typography>
            <Box component="ul" className="features-list">
              <li>הוספת פריטים לפי קטגוריות</li>
              <li>חיפוש וסינון פריטים</li>
              <li>שמירה ושיתוף רשימות</li>
              <li>הדפסת רשימות</li>
              <li>ניהול שמות לקוחות</li>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Error Display */}
      {error && (
        <Alert severity="error" className="error-alert">
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default ShoppingList;
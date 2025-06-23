import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Card,
  CardContent,
  CardActions,
  Divider
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Category,
  Save,
  Cancel,
  Warning
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  createCategory,
  updateCategory,
  deleteCategory
} from '../store/thunks/categoriesThunks';
import { CreateCategoryDto, UpdateCategoryDto } from '../types';
import './CategoriesManager.css';

// Validation Schema
const schema = yup.object({
  name: yup
    .string()
    .required('שם הקטגוריה הוא שדה חובה')
    .min(2, 'שם הקטגוריה חייב להכיל לפחות 2 תווים')
    .max(30, 'שם הקטגוריה לא יכול להכיל יותר מ-30 תווים')
});

interface CategoryFormData {
  name: string;
}

const CategoriesManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories, isLoading } = useAppSelector(state => state.categories);
  const { items } = useAppSelector(state => state.shoppingList);
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<CategoryFormData>({
    resolver: yupResolver(schema),
    defaultValues: { name: '' },
    mode: 'onChange'
  });

  const showMessage = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setShowSnackbar(true);
  };

  const handleAddCategory = async (data: CategoryFormData) => {
    try {
      await dispatch(createCategory({ name: data.name.trim() })).unwrap();
      showMessage('הקטגוריה נוספה בהצלחה!');
      setShowAddDialog(false);
      reset();
    } catch (error) {
      showMessage('שגיאה בהוספת הקטגוריה', 'error');
    }
  };

  const handleEditCategory = async (data: CategoryFormData) => {
    if (!selectedCategory) return;
    
    try {
      await dispatch(updateCategory({
        id: selectedCategory.id,
        data: { name: data.name.trim() }
      })).unwrap();
      showMessage('הקטגוריה עודכנה בהצלחה!');
      setShowEditDialog(false);
      setSelectedCategory(null);
      reset();
    } catch (error) {
      showMessage('שגיאה בעדכון הקטגוריה', 'error');
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    
    try {
      await dispatch(deleteCategory(selectedCategory.id)).unwrap();
      showMessage('הקטגוריה נמחקה בהצלחה!');
      setShowDeleteDialog(false);
      setSelectedCategory(null);
    } catch (error) {
      showMessage('שגיאה במחיקת הקטגוריה', 'error');
    }
  };

  const openEditDialog = (category: any) => {
    setSelectedCategory(category);
    reset({ name: category.name });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (category: any) => {
    setSelectedCategory(category);
    setShowDeleteDialog(true);
  };

  const getCategoryUsageCount = (categoryId: number) => {
    return items.filter(item => item.categoryId === categoryId).length;
  };

  const canDeleteCategory = (categoryId: number) => {
    return getCategoryUsageCount(categoryId) === 0;
  };

  return (
    <Box className="categories-manager">
      {/* Header */}
      <Card className="manager-header">
        <CardContent>
          <Box className="header-content">
            <Box className="header-icon">
              <Category />
            </Box>
            <Box className="header-text">
              <Typography variant="h5" className="header-title">
                ניהול קטגוריות
              </Typography>
              <Typography variant="body2" className="header-subtitle">
                נהל את הקטגוריות שלך - הוסף, ערוך או מחק
              </Typography>
            </Box>
            <Box className="header-stats">
              <Chip 
                label={`${categories.length} קטגוריות`}
                className="stats-chip"
              />
            </Box>
          </Box>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowAddDialog(true)}
            className="add-button"
            disabled={isLoading}
          >
            הוסף קטגוריה חדשה
          </Button>
        </CardActions>
      </Card>

      {/* Categories List */}
      <Card className="categories-list">
        <CardContent>
          <Typography variant="h6" className="list-title">
            רשימת קטגוריות ({categories.length})
          </Typography>
          
          {categories.length === 0 ? (
            <Box className="empty-state">
              <Category className="empty-icon" />
              <Typography variant="body1" className="empty-text">
                אין קטגוריות עדיין
              </Typography>
              <Typography variant="body2" className="empty-subtext">
                הוסף קטגוריה ראשונה כדי להתחיל
              </Typography>
            </Box>
          ) : (
            <List className="categories-items">
              {categories.map((category, index) => {
                const usageCount = getCategoryUsageCount(category.id);
                const canDelete = canDeleteCategory(category.id);
                
                return (
                  <React.Fragment key={category.id}>
                    <ListItem className="category-item">
                      <ListItemText
                        primary={
                          <Box className="category-info">
                            <Typography variant="body1" className="category-name">
                              {category.name}
                            </Typography>
                            <Box className="category-badges">
                              <Chip
                                size="small"
                                label={`${usageCount} פריטים`}
                                className={`usage-chip ${usageCount > 0 ? 'has-items' : 'no-items'}`}
                              />
                              {category.createdAt && (
                                <Chip
                                  size="small"
                                  label={new Date(category.createdAt).toLocaleDateString('he-IL')}
                                  className="date-chip"
                                />
                              )}
                            </Box>
                          </Box>
                        }
                      />
                      
                      <ListItemSecondaryAction>
                        <Box className="category-actions">
                          <IconButton
                            size="small"
                            onClick={() => openEditDialog(category)}
                            className="edit-button"
                            disabled={isLoading}
                          >
                            <Edit />
                          </IconButton>
                          
                          <IconButton
                            size="small"
                            onClick={() => openDeleteDialog(category)}
                            className="delete-button"
                            disabled={isLoading || !canDelete}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                    
                    {index < categories.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        maxWidth="sm"
        fullWidth
        className="category-dialog"
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Add />
            הוספת קטגוריה חדשה
          </Box>
        </DialogTitle>
        <form onSubmit={handleSubmit(handleAddCategory)}>
          <DialogContent>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  autoFocus
                  label="שם הקטגוריה"
                  fullWidth
                  variant="outlined"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  placeholder="לדוגמה: פירות וירקות"
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddDialog(false)} startIcon={<Cancel />}>
              ביטול
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!isValid || isLoading}
              startIcon={<Save />}
            >
              {isLoading ? 'שומר...' : 'שמור'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        maxWidth="sm"
        fullWidth
        className="category-dialog"
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Edit />
            עריכת קטגוריה
          </Box>
        </DialogTitle>
        <form onSubmit={handleSubmit(handleEditCategory)}>
          <DialogContent>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  autoFocus
                  label="שם הקטגוריה"
                  fullWidth
                  variant="outlined"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setShowEditDialog(false);
                setSelectedCategory(null);
                reset();
              }} 
              startIcon={<Cancel />}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!isValid || isLoading}
              startIcon={<Save />}
            >
              {isLoading ? 'מעדכן...' : 'עדכן'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
        className="delete-dialog"
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Warning color="error" />
            מחיקת קטגוריה
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            פעולה זו לא ניתנת לביטול!
          </Alert>
          <Typography variant="body1">
            האם אתה בטוח שברצונך למחוק את הקטגוריה "{selectedCategory?.name}"?
          </Typography>
          {selectedCategory && getCategoryUsageCount(selectedCategory.id) > 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              לא ניתן למחוק קטגוריה שיש בה {getCategoryUsageCount(selectedCategory.id)} פריטים.
              מחק תחילה את כל הפריטים בקטגוריה זו.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setShowDeleteDialog(false);
              setSelectedCategory(null);
            }}
            startIcon={<Cancel />}
          >
            ביטול
          </Button>
          <Button
            onClick={handleDeleteCategory}
            variant="contained"
            color="error"
            disabled={isLoading || (selectedCategory && !canDeleteCategory(selectedCategory.id))}
            startIcon={<Delete />}
          >
            {isLoading ? 'מוחק...' : 'מחק'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoriesManager;
import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemIcon,
  Collapse,
  Alert,
  Divider,
  Badge
} from '@mui/material';
import {
  Delete,
  Search,
  ShoppingCart,
  CheckCircle,
  RadioButtonUnchecked,
  ExpandLess,
  ExpandMore,
  Category,
  Clear,
  ShoppingBasket
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { ShoppingItem } from '../types';
import './ItemsList.css';

const ItemsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector(state => state.shoppingList);
  const { categories } = useAppSelector(state => state.categories);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<number>(0);
  const [showCompleted, setShowCompleted] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  // סינון הפריטים
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 0 || item.categoryId === filterCategory;
    // הסרתי את הבדיקה של isCompleted כי זה לא קיים במודל
    
    return matchesSearch && matchesCategory;
  });

  // קיבוץ פריטים לפי קטגוריות
  const groupedItems = filteredItems.reduce((groups, item) => {
    const categoryId = item.categoryId;
    if (!groups[categoryId]) {
      groups[categoryId] = [];
    }
    groups[categoryId].push(item);
    return groups;
  }, {} as Record<number, ShoppingItem[]>);

  // סטטיסטיקות
  const totalItems = items.length;

  const handleDeleteItem = (itemId: number) => {
    // נצטרך להוסיף את הפעולה הזו ל-store
    console.log('Delete item:', itemId);
  };

  const handleToggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getCategoryName = (categoryId: number) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'ללא קטגוריה';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory(0);
    setShowCompleted(true);
  };

  if (totalItems === 0) {
    return (
      <Box className="items-list empty-state">
        <Box className="empty-icon">
          <ShoppingBasket />
        </Box>
        <Typography variant="h6" className="empty-title">
          הרשימה ריקה
        </Typography>
        <Typography variant="body2" className="empty-subtitle">
          הוסף פריטים חדשים כדי להתחיל
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="items-list">
      {/* Header */}
      <Box className="list-header">
        <Box className="header-icon">
          <ShoppingCart />
        </Box>
        <Typography variant="h5" className="list-title">
          רשימת הקניות
        </Typography>
        <Badge badgeContent={totalItems} color="primary" className="items-badge">
          <ShoppingCart />
        </Badge>
      </Box>

      {/* Stats */}
      <Box className="stats-row">
        <Box className="stat-item">
          <Typography variant="body2" className="stat-label">סה"כ פריטים</Typography>
          <Typography variant="h6" className="stat-value">{totalItems}</Typography>
        </Box>
        <Box className="stat-item">
          <Typography variant="body2" className="stat-label">קטגוריות</Typography>
          <Typography variant="h6" className="stat-value">{Object.keys(groupedItems).length}</Typography>
        </Box>
        <Box className="stat-item">
          <Typography variant="body2" className="stat-label">פריטים מסוננים</Typography>
          <Typography variant="h6" className="stat-value">{filteredItems.length}</Typography>
        </Box>
      </Box>

      {/* Filters */}
      <Box className="filters-section">
        <TextField
          placeholder="חיפוש פריטים..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          className="search-field"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchTerm('')}>
                  <Clear />
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <FormControl size="small" className="category-filter">
          <InputLabel>קטגוריה</InputLabel>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as number)}
            label="קטגוריה"
          >
            <MenuItem value={0}>כל הקטגוריות</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box className="filter-actions">
          {(searchTerm || filterCategory !== 0) && (
            <Chip
              label="נקה סינונים"
              onClick={clearFilters}
              onDelete={clearFilters}
              deleteIcon={<Clear />}
              className="clear-filters-chip"
            />
          )}
        </Box>
      </Box>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <Alert severity="info" className="no-results-alert">
          לא נמצאו פריטים התואמים לחיפוש
        </Alert>
      ) : (
        <Box className="items-container">
          {Object.entries(groupedItems).map(([categoryId, categoryItems]) => {
            const catId = parseInt(categoryId);
            const isExpanded = expandedCategories.has(catId) || expandedCategories.size === 0;
            const categoryName = getCategoryName(catId);
            
            return (
              <Box key={categoryId} className="category-group">
                {/* Category Header */}
                <Box 
                  className="category-header"
                  onClick={() => handleToggleCategory(catId)}
                >
                  <Box className="category-info">
                    <Category className="category-icon" />
                    <Typography variant="subtitle1" className="category-name">
                      {categoryName}
                    </Typography>
                    <Chip 
                      label={categoryItems.length} 
                      size="small" 
                      className="category-count"
                    />
                  </Box>
                  <IconButton size="small">
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>

                {/* Category Items */}
                <Collapse in={isExpanded} timeout="auto">
                  <List className="category-items">
                    {categoryItems.map((item, index) => (
                      <React.Fragment key={item.id}>
                        <ListItem className="item-row">
                          <ListItemIcon>
                            <ShoppingBasket color="action" />
                          </ListItemIcon>
                          
                          <ListItemText
                            primary={
                              <Typography variant="body1" className="item-name">
                                {item.name}
                              </Typography>
                            }
                            secondary={
                              <Box className="item-details">
                                <Typography variant="caption" className="item-category">
                                  {item.categoryName}
                                </Typography>
                                {item.quantity && item.quantity > 1 && (
                                  <Chip 
                                    label={`כמות: ${item.quantity}`}
                                    size="small"
                                    className="quantity-chip"
                                  />
                                )}
                                {item.createdAt && (
                                  <Typography variant="caption" className="item-date">
                                    נוסף: {new Date(item.createdAt).toLocaleDateString('he-IL')}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                          
                          <ListItemSecondaryAction>
                            <Box className="item-actions">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteItem(item.id)}
                                className="delete-button"
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          </ListItemSecondaryAction>
                        </ListItem>
                        
                        {index < categoryItems.length - 1 && (
                          <Divider variant="inset" component="li" />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                </Collapse>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default ItemsList;
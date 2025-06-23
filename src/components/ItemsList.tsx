import React, { useEffect, useState } from "react";
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
  Collapse,
  Alert,
  Divider,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Delete,
  Search,
  ShoppingCart,
  ExpandLess,
  ExpandMore,
  Category,
  Clear,
  ShoppingBasket,
  Edit,
  Add,
  Remove,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  removeLocalItem,
  updateLocalItemQuantity,
} from "../store/slices/shoppingListSlice";
import { ShoppingItem } from "../types";
import "./ItemsList.css";

const ItemsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.shoppingList);
  const { categories } = useAppSelector((state) => state.categories);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<number>(0);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    () => {
      // פתח את כל הקטגוריות כברירת מחדל
      return new Set(categories.map((cat) => cat.id));
    }
  );
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    item: ShoppingItem | null;
  }>({
    open: false,
    item: null,
  });
 
  // סינון הפריטים
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === 0 || item.categoryId === filterCategory;

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
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleDeleteItem = (item: ShoppingItem) => {
    dispatch(removeLocalItem(item.id));
    setDeleteDialog({ open: true, item });
  };

  const confirmDelete = () => {
    if (deleteDialog.item) {
      dispatch(removeLocalItem(deleteDialog.item.id));
    }
    setDeleteDialog({ open: false, item: null });
  };

  const handleQuantityChange = (itemId: number, change: number) => {
    const item = items.find((i) => i.id === itemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        dispatch(
          updateLocalItemQuantity({ id: itemId, quantity: newQuantity })
        );
      } else {
        handleDeleteItem(item);
      }
    }
  };

  const handleToggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(categoryId)) {
        newExpanded.delete(categoryId);
      } else {
        newExpanded.add(categoryId);
      }
      return newExpanded;
    });
  };
  useEffect(() => {
    // כשיש קטגוריות חדשות, פתח אותן אוטומטית
    setExpandedCategories(prev => {
      const newExpanded = new Set(prev);
      categories.forEach(cat => newExpanded.add(cat.id));
      return newExpanded;
    });
  }, [categories]);

  const getCategoryName = (categoryId: number) => {
    return (
      categories.find((cat) => cat.id === categoryId)?.name || "ללא קטגוריה"
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory(0);
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
        <Badge
          badgeContent={totalQuantity}
          color="primary"
          className="items-badge"
        >
          <ShoppingCart />
        </Badge>
      </Box>

      {/* Stats */}
      <Box className="stats-row">
        <Box className="stat-item">
          <Typography variant="body2" className="stat-label">
            פריטים ייחודיים
          </Typography>
          <Typography variant="h6" className="stat-value">
            {totalItems}
          </Typography>
        </Box>
        <Box className="stat-item">
          <Typography variant="body2" className="stat-label">
            כמות כוללת
          </Typography>
          <Typography variant="h6" className="stat-value">
            {totalQuantity}
          </Typography>
        </Box>
        <Box className="stat-item">
          <Typography variant="body2" className="stat-label">
            קטגוריות
          </Typography>
          <Typography variant="h6" className="stat-value">
            {Object.keys(groupedItems).length}
          </Typography>
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
                <IconButton size="small" onClick={() => setSearchTerm("")}>
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
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
            const isExpanded = expandedCategories.has(catId);


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
                          <ListItemText
                            primary={
                              <Box className="item-primary">
                                <Typography
                                  variant="body1"
                                  className="item-name"
                                >
                                  {item.name}
                                </Typography>
                                <Box className="quantity-controls">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleQuantityChange(item.id, -1)
                                    }
                                    className="quantity-btn"
                                  >
                                    <Remove />
                                  </IconButton>
                                  <Chip
                                    label={item.quantity}
                                    size="small"
                                    className="quantity-chip"
                                  />
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleQuantityChange(item.id, 1)
                                    }
                                    className="quantity-btn"
                                  >
                                    <Add />
                                  </IconButton>
                                </Box>
                              </Box>
                            }
                            secondary={
                              <Box className="item-details">
                                <Typography
                                  variant="caption"
                                  className="item-category"
                                >
                                  {item.categoryName}
                                </Typography>
                                {item.createdAt && (
                                  <Typography
                                    variant="caption"
                                    className="item-date"
                                  >
                                    נוסף:{" "}
                                    {new Date(
                                      item.createdAt
                                    ).toLocaleDateString("he-IL")}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />

                          <ListItemSecondaryAction>
                            <Box className="item-actions">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteItem(item)}
                                className="delete-button"
                                color="error"
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, item: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Delete color="error" />
            מחיקת פריט
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            האם אתה בטוח שברצונך למחוק את הפריט "{deleteDialog.item?.name}"?
          </Typography>
          {deleteDialog.item && deleteDialog.item.quantity > 1 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              הפריט מכיל {deleteDialog.item.quantity} יחידות
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, item: null })}
            color="inherit"
          >
            ביטול
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            startIcon={<Delete />}
          >
            מחק
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ItemsList;

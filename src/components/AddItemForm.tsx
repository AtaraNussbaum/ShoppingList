import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Chip,
  Alert,
  Collapse,
  InputAdornment,
} from "@mui/material";
import {
  Add,
  ShoppingBasket,
  Category,
  Numbers,
  Close,
  CheckCircle,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addLocalItem } from "../store/slices/shoppingListSlice";
import { fetchCategories } from "../store/thunks/categoriesThunks";
import { AddItemFormData } from "../types";
import "./AddItemForm.css";

// Validation Schema
const schema = yup.object({
  name: yup
    .string()
    .required("שם הפריט הוא שדה חובה")
    .min(2, "שם הפריט חייב להכיל לפחות 2 תווים")
    .max(50, "שם הפריט לא יכול להכיל יותר מ-50 תווים"),
  categoryId: yup
    .number()
    .required("יש לבחור קטגוריה")
    .min(1, "יש לבחור קטגוריה תקינה"),
  quantity: yup
    .number()
    .required("כמות היא שדה חובה")
    .min(1, "הכמות חייבת להיות לפחות 1")
    .max(100, "הכמות לא יכולה להיות יותר מ-100"),
});

const AddItemForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories, isLoading: categoriesLoading } = useAppSelector(
    (state) => state.categories
  );
  const { items } = useAppSelector((state) => state.shoppingList);

  const [showSuccess, setShowSuccess] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<string>("");

  // טעינת קטגוריות בעת הרכבת הקומפוננט אם הן לא נטענו
  useEffect(() => {
    if (categories.length === 0 && !categoriesLoading) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length, categoriesLoading]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    watch,
  } = useForm<AddItemFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      categoryId: 0,
      quantity: 1,
    },
    mode: "onChange",
  });

  const watchedName = watch("name");
  const watchedCategoryId = watch("categoryId");

  // בדיקה אם הפריט כבר קיים
  const itemExists = items.some(
    (item) =>
      item.name.toLowerCase() === watchedName?.toLowerCase() &&
      item.categoryId === watchedCategoryId
  );

  const onSubmit = (data: AddItemFormData) => {
    const selectedCategory = categories.find(
      (cat) => cat.id === data.categoryId
    );

    if (selectedCategory) {
      dispatch(
        addLocalItem({
          name: data.name.trim(),
          categoryId: data.categoryId,
          categoryName: selectedCategory.name,
        })
      );

      setLastAddedItem(data.name);
      setShowSuccess(true);
      reset();

      // הסתרת הודעת הצלחה אחרי 3 שניות
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  };

  const quickAddItems = [
    { name: "חלב", icon: "🥛" },
    { name: "לחם", icon: "🍞" },
    { name: "ביצים", icon: "🥚" },
    { name: "בננות", icon: "🍌" },
    { name: "עגבניות", icon: "🍅" },
    { name: "גבינה", icon: "🧀" },
  ];

  const handleQuickAdd = (itemName: string) => {
    // בדיקה אם יש קטגוריות זמינות
    if (categories.length === 0) {
      // נטען קטגוריות אם הן לא קיימות
      dispatch(fetchCategories());
      return;
    }

    // מציאת קטגוריה מתאימה (אם קיימת)
    const defaultCategory =
      categories.find(
        (cat) => cat.name.includes("כללי") || cat.name.includes("בסיסי")
      ) || categories[0];

    if (defaultCategory) {
      dispatch(
        addLocalItem({
          name: itemName,
          categoryId: defaultCategory.id,
          categoryName: defaultCategory.name,
        })
      );

      setLastAddedItem(itemName);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <Box className="add-item-form">
      {/* Header */}
      <Box className="form-header">
        <Box className="header-icon">
          <Add />
        </Box>
        <Typography variant="h5" className="form-title">
          הוספת פריט חדש
        </Typography>
      </Box>

      {/* Success Alert */}
      <Collapse in={showSuccess}>
        <Alert
          severity="success"
          className="success-alert"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setShowSuccess(false)}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }
        >
          <Box display="flex" alignItems="center" gap={1}>
            <CheckCircle fontSize="small" />
            <span>הפריט "{lastAddedItem}" נוסף בהצלחה!</span>
          </Box>
        </Alert>
      </Collapse>

      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="form-content">
        <Box className="form-fields">
          {/* Item Name */}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="שם הפריט"
                variant="outlined"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ShoppingBasket color="action" />
                    </InputAdornment>
                  ),
                }}
                className="form-field"
              />
            )}
          />

          {/* Category Selection */}
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <FormControl
                fullWidth
                error={!!errors.categoryId}
                className="form-field"
              >
                <InputLabel>קטגוריה</InputLabel>
                <Select
                  {...field}
                  label="קטגוריה"
                  startAdornment={
                    <InputAdornment position="start">
                      <Category color="action" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value={0} disabled>
                    בחר קטגוריה
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.categoryId && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, mr: 2 }}
                  >
                    {errors.categoryId.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />

          {/* Quantity */}
          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="כמות"
                type="number"
                variant="outlined"
                fullWidth
                error={!!errors.quantity}
                helperText={errors.quantity?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Numbers color="action" />
                    </InputAdornment>
                  ),
                  inputProps: { min: 1, max: 100 },
                }}
                className="form-field"
              />
            )}
          />
        </Box>

        {/* Categories Loading/Error Alert */}
        {categoriesLoading && (
          <Alert severity="info" className="info-alert">
            טוען קטגוריות...
          </Alert>
        )}

        {!categoriesLoading && categories.length === 0 && (
          <Alert
            severity="warning"
            className="warning-alert"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => dispatch(fetchCategories())}
              >
                טען קטגוריות
              </Button>
            }
          >
            לא נמצאו קטגוריות. יש ליצור קטגוריות תחילה.
          </Alert>
        )}

        {/* Item Exists Warning */}
        {itemExists && watchedName && watchedCategoryId > 0 && (
          <Alert severity="warning" className="warning-alert">
            פריט זה כבר קיים ברשימה. הוספתו תגדיל את הכמות.
          </Alert>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={!isValid || categoriesLoading}
          className="submit-button"
          startIcon={<Add />}
        >
          {categoriesLoading ? "טוען קטגוריות..." : "הוסף לרשימה"}
        </Button>
      </form>

      {/* Quick Add Section */}
      <Box className="quick-add-section">
        <Typography variant="h6" className="quick-add-title">
          הוספה מהירה
        </Typography>
        <Box className="quick-add-chips">
          {quickAddItems.map((item) => (
            <Chip
              key={item.name}
              label={
                <Box display="flex" alignItems="center" gap={0.5}>
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Box>
              }
              onClick={() => handleQuickAdd(item.name)}
              className="quick-add-chip"
              variant="outlined"
              disabled={categories.length === 0}
            />
          ))}
        </Box>
      </Box>

      {/* Stats */}
      <Box className="form-stats">
        <Typography variant="body2" color="text.secondary">
          סה"כ פריטים ברשימה: {items.length}
        </Typography>
      </Box>
    </Box>
  );
};

export default AddItemForm;

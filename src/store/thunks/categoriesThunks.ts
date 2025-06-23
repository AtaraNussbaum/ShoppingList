import { createAsyncThunk } from '@reduxjs/toolkit';
import { categoriesApi } from '../../services/api';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../../types';

// Fetch all categories
export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoriesApi.getAll();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'שגיאה בטעינת הקטגוריות'
      );
    }
  }
);

// Create category
export const createCategory = createAsyncThunk<
  Category,
  CreateCategoryDto,
  { rejectValue: string }
>(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await categoriesApi.create(categoryData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'שגיאה ביצירת הקטגוריה'
      );
    }
  }
);

// Update category
export const updateCategory = createAsyncThunk<
  Category,
  { id: number; data: UpdateCategoryDto },
  { rejectValue: string }
>(
  'categories/updateCategory',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await categoriesApi.update(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'שגיאה בעדכון הקטגוריה'
      );
    }
  }
);

// Delete category
export const deleteCategory = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await categoriesApi.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'שגיאה במחיקת הקטגוריה'
      );
    }
  }
);
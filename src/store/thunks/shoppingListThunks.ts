import { createAsyncThunk } from '@reduxjs/toolkit';
import { shoppingListsApi } from '../../services/api';
import {
  ShoppingList,
  CreateShoppingListDto,
  UpdateShoppingListDto,
  ShoppingItem,
  CreateShoppingItemDto,
  UpdateShoppingItemDto
} from '../../types';

// Fetch all shopping lists
export const fetchShoppingLists = createAsyncThunk<
  ShoppingList[],
  void,
  { rejectValue: string }
>(
  'shoppingList/fetchShoppingLists',
  async (_, { rejectWithValue }) => {
    try {
      const response = await shoppingListsApi.getAll();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'שגיאה בטעינת רשימות הקניות'
      );
    }
  }
);

// Create shopping list
export const createShoppingList = createAsyncThunk<
  ShoppingList,
  CreateShoppingListDto,
  { rejectValue: string }
>(
  'shoppingList/createShoppingList',
  async (listData, { rejectWithValue }) => {
    try {
      const response = await shoppingListsApi.create(listData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'שגיאה ביצירת רשימת הקניות'
      );
    }
  }
);

// Update shopping list
export const updateShoppingList = createAsyncThunk<
  ShoppingList,
  { id: number; data: UpdateShoppingListDto },
  { rejectValue: string }
>(
  'shoppingList/updateShoppingList',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await shoppingListsApi.update(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'שגיאה בעדכון רשימת הקניות'
      );
    }
  }
);

// Add item to list
export const addItemToList = createAsyncThunk<
  ShoppingItem,
  { listId: number; item: CreateShoppingItemDto },
  { rejectValue: string }
>(
  'shoppingList/addItemToList',
  async ({ listId, item }, { rejectWithValue }) => {
    try {
      const response = await shoppingListsApi.addItem(listId, item);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'שגיאה בהוספת הפריט'
      );
    }
  }
);

// Update item in list
export const updateItemInList = createAsyncThunk<
  ShoppingItem,
  { listId: number; itemId: number; data: UpdateShoppingItemDto },
  { rejectValue: string }
>(
  'shoppingList/updateItemInList',
  async ({ listId, itemId, data }, { rejectWithValue }) => {
    try {
      const response = await shoppingListsApi.updateItem(listId, itemId, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'שגיאה בעדכון הפריט'
      );
    }
  }
);

// Remove item from list
export const removeItemFromList = createAsyncThunk<
  number,
  { listId: number; itemId: number },
  { rejectValue: string }
>(
  'shoppingList/removeItemFromList',
  async ({ listId, itemId }, { rejectWithValue }) => {
    try {
      await shoppingListsApi.removeItem(listId, itemId);
      return itemId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'שגיאה במחיקת הפריט'
      );
    }
  }
);

// Complete order - save current items to server
export const completeOrder = createAsyncThunk<
  ShoppingList,
  { customerName?: string },
  { rejectValue: string }
>(
  'shoppingList/completeOrder',
  async ({ customerName }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const items = state.shoppingList.items;
      
      // Convert local items to CreateShoppingItemDto format
      const itemsToCreate = items.map((item: ShoppingItem) => ({
        name: item.name,
        quantity: item.quantity,
        categoryId: item.categoryId,
      }));

      const orderData: CreateShoppingListDto = {
        customerName,
        items: itemsToCreate,
      };

      const response = await shoppingListsApi.create(orderData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'שגיאה בשמירת ההזמנה'
      );
    }
  }
);

// Delete shopping list
export const deleteShoppingList = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  'shoppingList/deleteShoppingList',
  async (id, { rejectWithValue }) => {
    try {
      await shoppingListsApi.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'שגיאה במחיקת רשימת הקניות'
      );
    }
  }
);
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShoppingListState, ShoppingItem, ShoppingList } from '../../types';
import {
  fetchShoppingLists,
  createShoppingList,
  updateShoppingList,
  addItemToList,
  updateItemInList,
  removeItemFromList,
  completeOrder,
  deleteShoppingList
} from '../thunks/shoppingListThunks';

const initialState: ShoppingListState = {
  currentList: null,
  items: [],
  totalItems: 0,
  isLoading: false,
  error: null,
};

const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentList: (state) => {
      state.currentList = null;
      state.items = [];
      state.totalItems = 0;
    },
    updateTotalItems: (state) => {
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
    },
    // Local item management (before saving to server)
    addLocalItem: (state, action: PayloadAction<{ name: string; categoryId: number; categoryName: string }>) => {
      const { name, categoryId, categoryName } = action.payload;
      const existingItem = state.items.find(item => 
        item.name.toLowerCase() === name.toLowerCase() && item.categoryId === categoryId
      );
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        const newItem: ShoppingItem = {
          id: Date.now(), // Temporary ID
          name,
          quantity: 1,
          categoryId,
          categoryName,
          shoppingListId: 0, // Will be set when saved
          createdAt: new Date().toISOString(),
        };
        state.items.push(newItem);
      }
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
    },
    removeLocalItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
    },
    updateLocalItemQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i.id !== action.payload.id);
        }
      }
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Shopping List
      .addCase(createShoppingList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createShoppingList.fulfilled, (state, action: PayloadAction<ShoppingList>) => {
        state.isLoading = false;
        state.currentList = action.payload;
        // Clear local items after successful save
        state.items = [];
        state.totalItems = 0;
      })
      .addCase(createShoppingList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Add Item to List
      .addCase(addItemToList.fulfilled, (state, action: PayloadAction<ShoppingItem>) => {
        const existingItemIndex = state.items.findIndex(item => 
          item.name === action.payload.name && item.categoryId === action.payload.categoryId
        );
        
        if (existingItemIndex !== -1) {
          state.items[existingItemIndex] = action.payload;
        } else {
          state.items.push(action.payload);
        }
        state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      })
      
      // Update Item
      .addCase(updateItemInList.fulfilled, (state, action: PayloadAction<ShoppingItem>) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      })
      
      // Remove Item
      .addCase(removeItemFromList.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      })
      
      // Complete Order
      .addCase(completeOrder.fulfilled, (state, action: PayloadAction<ShoppingList>) => {
        state.currentList = action.payload;
        // Clear local items after successful completion
        state.items = [];
        state.totalItems = 0;
      })
      
      // Delete Shopping List
      .addCase(deleteShoppingList.fulfilled, (state, action: PayloadAction<number>) => {
        if (state.currentList && state.currentList.id === action.payload) {
          state.currentList = null;
          state.items = [];
          state.totalItems = 0;
        }
      });
  },
});

export const { 
  clearError, 
  clearCurrentList, 
  updateTotalItems,
  addLocalItem,
  removeLocalItem,
  updateLocalItemQuantity
} = shoppingListSlice.actions;

export default shoppingListSlice.reducer;
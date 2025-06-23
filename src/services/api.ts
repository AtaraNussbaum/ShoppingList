import axios from 'axios';
import { environment } from '../environments';
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  ShoppingList,
  CreateShoppingListDto,
  UpdateShoppingListDto,
  ShoppingItem,
  CreateShoppingItemDto,
  UpdateShoppingItemDto
} from '../types';

const api = axios.create({
  baseURL: environment.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for logging in development
api.interceptors.request.use(
  (config) => {
    if (!environment.production) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    if (!environment.production) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    if (!environment.production) {
      console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data);
    }
    return Promise.reject(error);
  }
);

// Categories API
export const categoriesApi = {
  getAll: () => api.get<Category[]>('/categories'),
  getById: (id: number) => api.get<Category>(`/categories/${id}`),
  create: (data: CreateCategoryDto) => api.post<Category>('/categories', data),
  update: (id: number, data: UpdateCategoryDto) => api.put<Category>(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

// Shopping Lists API
export const shoppingListsApi = {
  getAll: () => api.get<ShoppingList[]>('/shoppinglists'),
  getById: (id: number) => api.get<ShoppingList>(`/shoppinglists/${id}`),
  create: (data: CreateShoppingListDto) => api.post<ShoppingList>('/shoppinglists', data),
  update: (id: number, data: UpdateShoppingListDto) => api.put<ShoppingList>(`/shoppinglists/${id}`, data),
  delete: (id: number) => api.delete(`/shoppinglists/${id}`),
  
  // Items management
  addItem: (listId: number, data: CreateShoppingItemDto) => 
    api.post<ShoppingItem>(`/shoppinglists/${listId}/items`, data),
  updateItem: (listId: number, itemId: number, data: UpdateShoppingItemDto) => 
    api.put<ShoppingItem>(`/shoppinglists/${listId}/items/${itemId}`, data),
  removeItem: (listId: number, itemId: number) => 
    api.delete(`/shoppinglists/${listId}/items/${itemId}`),
};

export default api;
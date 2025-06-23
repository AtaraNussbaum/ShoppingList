// Category Types
export interface Category {
  id: number;
  name: string;
  createdAt?: string;
}

export interface CreateCategoryDto {
  name: string;
}

export interface UpdateCategoryDto {
  name: string;
}

// Shopping Item Types
export interface ShoppingItem {
  id: number;
  name: string;
  quantity: number;
  categoryId: number;
  categoryName: string;
  shoppingListId: number;
  createdAt?: string;
}

export interface CreateShoppingItemDto {
  name: string;
  quantity: number;
  categoryId: number;
}

export interface UpdateShoppingItemDto {
  name: string;
  quantity: number;
  categoryId: number;
}

// Shopping List Types
export interface ShoppingList {
  id: number;
  customerName?: string;
  createdAt?: string;
  isCompleted: boolean;
  items: ShoppingItem[];
}

export interface CreateShoppingListDto {
  customerName?: string;
  items: CreateShoppingItemDto[];
}

export interface UpdateShoppingListDto {
  customerName?: string;
  isCompleted: boolean;
}

// UI State Types
export interface ShoppingListState {
  currentList: ShoppingList | null;
  items: ShoppingItem[];
  totalItems: number;
  isLoading: boolean;
  error: string | null;
}

export interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

// Form Types
export interface AddItemFormData {
  name: string;
  categoryId: number;
  quantity: number;
}
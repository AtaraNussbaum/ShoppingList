import React, { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Container,
  Button,
  Alert,
} from "@mui/material";
import CategoriesManager from "./components/CategoriesManager";

import { ShoppingCart, Category, Receipt } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { fetchCategories } from "./store/thunks/categoriesThunks";
import ShoppingList from "./components/ShoppingList";
import "./App.css";
import Footer from "./components/Footer";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const [currentView, setCurrentView] = useState<"shopping" | "categories">(
    "shopping"
  );
  const { totalItems, isLoading } = useAppSelector(
    (state) => state.shoppingList
  );
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useAppSelector((state) => state.categories);

  useEffect(() => {
    // טעינת קטגוריות בהפעלה
    dispatch(fetchCategories());
  }, [dispatch]);

  // ניסיון חוזר לטעינת קטגוריות במקרה של שגיאה
  useEffect(() => {
    if (categoriesError && categories.length === 0) {
      const retryTimer = setTimeout(() => {
        console.log("מנסה שוב לטעון קטגוריות בעקבות שגיאה");
        dispatch(fetchCategories());
      }, 5000); // ניסיון חוזר אחרי 5 שניות

      return () => clearTimeout(retryTimer);
    }
  }, [categoriesError, categories.length, dispatch]);

  // וידוא טעינת קטגוריות כשמעברים לתצוגה
  useEffect(() => {
    if (categories.length === 0 && !categoriesLoading && !categoriesError) {
      console.log("טוען קטגוריות בעקבות מעבר לתצוגה");
      dispatch(fetchCategories());
    }
  }, [
    currentView,
    categories.length,
    categoriesLoading,
    categoriesError,
    dispatch,
  ]);

  return (
    <Box className="app-container">
      {/* Header */}
      <AppBar position="sticky" className="app-header">
        <Toolbar>
          <Box display="flex" alignItems="center" gap={2}>
            <ShoppingCart sx={{ fontSize: 28 }} />
            <Typography variant="h6" component="h1" className="app-title">
              רשימת קניות חכמה
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box display="flex" alignItems="center" gap={1}>
            <IconButton color="inherit">
              <Badge badgeContent={categories.length} color="secondary">
                <Category />
              </Badge>
            </IconButton>

            <IconButton color="inherit">
              <Badge badgeContent={totalItems} color="secondary">
                <Receipt />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" className="main-container">
        <Box className="content-wrapper">
          {/* Hero Section */}
          <Box className="hero-section slide-up">
            <Typography variant="h4" component="h2" className="hero-title">
              {currentView === "shopping"
                ? "ברוכים הבאים לרשימת הקניות החכמה"
                : "ניהול קטגוריות"}
            </Typography>
            <Typography variant="body1" className="hero-subtitle">
              {currentView === "shopping"
                ? "נהלו את הקניות שלכם בקלות ויעילות"
                : "נהלו את הקטגוריות שלכם - הוסיפו, ערכו או מחקו"}
            </Typography>

            {/* Navigation Buttons */}
            <Box
              sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "center" }}
            >
              <Button
                variant={currentView === "shopping" ? "contained" : "outlined"}
                startIcon={<ShoppingCart />}
                onClick={() => setCurrentView("shopping")}
                sx={{
                  borderRadius: "12px",
                  background:
                    currentView === "shopping"
                      ? "linear-gradient(135deg, #2E7D32, #4CAF50)"
                      : "transparent",
                }}
              >
                רשימת קניות
              </Button>
              <Button
                variant={
                  currentView === "categories" ? "contained" : "outlined"
                }
                startIcon={<Category />}
                onClick={() => setCurrentView("categories")}
                sx={{
                  borderRadius: "12px",
                  background:
                    currentView === "categories"
                      ? "linear-gradient(135deg, #FF6B35, #FF8A65)"
                      : "transparent",
                }}
              >
                ניהול קטגוריות
              </Button>
            </Box>
          </Box>

          {/* Error Alert for Categories */}
          {categoriesError && categories.length === 0 && (
            <Box className="error-section" sx={{ mb: 2 }}>
              <Alert
                severity="warning"
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => dispatch(fetchCategories())}
                    disabled={categoriesLoading}
                  >
                    נסה שוב
                  </Button>
                }
              >
                שגיאה בטעינת הקטגוריות. {categoriesError}
              </Alert>
            </Box>
          )}

          {/* Conditional Content */}
          {currentView === "shopping" ? (
            <>
              {/* Stats Cards */}
              <Box className="stats-container fade-in">
                <Box className="stat-card">
                  <Box className="stat-icon primary">
                    <ShoppingCart />
                  </Box>
                  <Box>
                    <Typography variant="h6" className="stat-number">
                      {totalItems}
                    </Typography>
                    <Typography variant="body2" className="stat-label">
                      פריטים בסל
                    </Typography>
                  </Box>
                </Box>

                <Box className="stat-card">
                  <Box className="stat-icon secondary">
                    <Category />
                  </Box>
                  <Box>
                    <Typography variant="h6" className="stat-number">
                      {categories.length}
                    </Typography>
                    <Typography variant="body2" className="stat-label">
                      קטגוריות זמינות
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Shopping List Actions */}
              <Box className="actions-section">
                <ShoppingList />
              </Box>
            </>
          ) : (
            /* Categories Manager */
            <CategoriesManager />
          )}
        </Box>
      </Container>

      {/* Loading Overlay */}
      {isLoading && (
        <Box className="loading-overlay">
          <Box className="loading-spinner">
            <ShoppingCart className="spinning-icon" />
            <Typography variant="body1" sx={{ mt: 2 }}>
              טוען...
            </Typography>
          </Box>
        </Box>
      )}
      <Footer />
    </Box>
  );
};

export default App;

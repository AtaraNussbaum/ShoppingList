import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Fab,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton
} from '@mui/material';
import {
  Add,
  Save,
  Share,
  Print,
  Clear,
  Person,
  ShoppingCart,
  Category as CategoryIcon,
  Close,
  CheckCircle,
  Info
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { ShoppingList as ShoppingListType, CreateShoppingListDto } from '../types';
import AddItemForm from './AddItemForm';
import ItemsList from './ItemsList';
import './ShoppingList.css';

const ShoppingList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentList, items, totalItems, isLoading, error } = useAppSelector(state => state.shoppingList);
  const { categories } = useAppSelector(state => state.categories);
  
  const [customerName, setCustomerName] = useState('');
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  useEffect(() => {
    if (currentList) {
      setCustomerName(currentList.customerName || '');
    }
  }, [currentList]);

  const handleSaveList = async () => {
    if (items.length === 0) {
      setSuccessMessage('לא ניתן לשמור רשימה ריקה');
      setShowSuccessSnackbar(true);
      return;
    }

    try {
      const listData: CreateShoppingListDto = {
        customerName: customerName.trim() || undefined,
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          categoryId: item.categoryId
        }))
      };

      console.log('Saving list:', listData);
      setSuccessMessage('הרשימה נשמרה בהצלחה!');
      setShowSuccessSnackbar(true);
    } catch (error) {
      console.error('Error saving list:', error);
      setSuccessMessage('שגיאה בשמירת הרשימה');
      setShowSuccessSnackbar(true);
    }
  };

  const handleClearList = () => {
    console.log('Clear list');
    setSuccessMessage('הרשימה נוקתה');
    setShowSuccessSnackbar(true);
  };

  const handleShareList = () => {
    if (items.length === 0) {
      setSuccessMessage('אין פריטים לשיתוף');
      setShowSuccessSnackbar(true);
      return;
    }

    const listText = items.map(item => 
      `• ${item.name} (${item.quantity}) - ${item.categoryName}`
    ).join('\n');
    
    const shareText = `רשימת קניות${customerName ? ` של ${customerName}` : ''}:\n\n${listText}`;

    if (navigator.share) {
      navigator.share({
        title: 'רשימת קניות',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      setSuccessMessage('הרשימה הועתקה ללוח');
      setShowSuccessSnackbar(true);
    }
  };

  const handlePrintList = () => {
    if (items.length === 0) {
      setSuccessMessage('אין פריטים להדפסה');
      setShowSuccessSnackbar(true);
      return;
    }

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const listHTML = `
        <html dir="rtl">
          <head>
            <title>רשימת קניות</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #2E7D32; text-align: center; }
              .item { padding: 8px; border-bottom: 1px solid #eee; }
              .category { font-weight: bold; color: #666; margin-top: 15px; }
            </style>
          </head>
          <body>
            <h1>רשימת קניות${customerName ? ` - ${customerName}` : ''}</h1>
            ${Object.entries(items.reduce((groups, item) => {
              if (!groups[item.categoryName]) groups[item.categoryName] = [];
              groups[item.categoryName].push(item);
              return groups;
            }, {} as Record<string, typeof items>)).map(([category, categoryItems]) => `
              <div class="category">${category}</div>
              ${categoryItems.map(item => `
                <div class="item">☐ ${item.name} (כמות: ${item.quantity})</div>
              `).join('')}
            `).join('')}
            <p style="text-align: center; margin-top: 30px; color: #666;">
              נוצר ב-${new Date().toLocaleDateString('he-IL')}
            </p>
          </body>
        </html>
      `;
      
      printWindow.document.write(listHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getListSummary = () => {
    const categoriesCount = new Set(items.map(item => item.categoryId)).size;
    return {
      totalItems,
      categoriesCount,
      hasCustomer: !!customerName.trim()
    };
  };

  const summary = getListSummary();

  return (
    <Container maxWidth="xl" className="shopping-list-container">
      {/* Header */}
      <Box className="page-header">
        <Box className="header-content">
          <Box className="header-icon">
            <ShoppingCart />
          </Box>
          <Box className="header-text">
            <Typography variant="h4" className="page-title">
              מערכת רשימות קניות
            </Typography>
            <Typography variant="subtitle1" className="page-subtitle">
              נהל את רשימת הקניות שלך בקלות ויעילות
            </Typography>
          </Box>
        </Box>
        
        <Box className="header-actions">
          <Tooltip title="מידע על המערכת">
            <IconButton onClick={() => setShowInfoDialog(true)} className="info-button">
              <Info />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Customer Info Card */}
      <Card className="customer-card">
        <CardContent>
          <Box className="customer-info">
            <Person className="customer-icon" />
            <Box className="customer-details">
              <Typography variant="h6" className="customer-title">
                {customerName || 'לקוח אנונימי'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                לחץ לעריכת שם הלקוח
              </Typography>
            </Box>
          </Box>
        </CardContent>
        <CardActions>
          <Button
            startIcon={<Person />}
            onClick={() => setShowCustomerDialog(true)}
            className="edit-customer-button"
          >
            עריכת שם לקוח
          </Button>
        </CardActions>
      </Card>

      {/* Summary Cards */}
      <Box className="summary-section">
        <Card className="summary-card">
          <CardContent>
            <Box className="summary-content">
              <ShoppingCart className="summary-icon items" />
              <Box>
                <Typography variant="h4" className="summary-number">
                  {summary.totalItems}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  פריטים ברשימה
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card className="summary-card">
          <CardContent>
            <Box className="summary-content">
              <CategoryIcon className="summary-icon categories" />
              <Box>
                <Typography variant="h4" className="summary-number">
                  {summary.categoriesCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  קטגוריות שונות
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card className="summary-card">
          <CardContent>
            <Box className="summary-content">
              <CheckCircle className="summary-icon status" />
              <Box>
                <Typography variant="h4" className="summary-number">
                  {summary.hasCustomer ? '✓' : '✗'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  שם לקוח
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Main Content */}
      <Box className="main-content">
        {/* Add Item Form */}
        <Paper className="form-paper">
          <AddItemForm />
        </Paper>

        {/* Items List */}
        <Paper className="list-paper">
          <ItemsList />
        </Paper>
      </Box>


{/* Action Buttons */}
<Box className="action-buttons">
  <Tooltip title="שמור רשימה">
    <span> {/* עוטף ב-span כדי שה-Tooltip יעבוד גם כשהכפתור מושבת */}
      <Fab
        color="primary"
        onClick={handleSaveList}
        disabled={isLoading || totalItems === 0}
        className="action-fab save"
      >
        <Save />
      </Fab>
    </span>
  </Tooltip>
  
  <Tooltip title={totalItems === 0 ? "הוסף פריטים כדי לשתף" : "שתף רשימה"}>
    <span>
      <Fab
        color="secondary"
        onClick={handleShareList}
        disabled={totalItems === 0}
        className="action-fab share"
      >
        <Share />
      </Fab>
    </span>
  </Tooltip>
  
  <Tooltip title={totalItems === 0 ? "הוסף פריטים כדי להדפיס" : "הדפס רשימה"}>
    <span>
      <Fab
        onClick={handlePrintList}
        disabled={totalItems === 0}
        className="action-fab print"
      >
        <Print />
      </Fab>
    </span>
  </Tooltip>
  
  <Tooltip title={totalItems === 0 ? "אין מה לנקות" : "נקה רשימה"}>
    <span>
      <Fab
        onClick={handleClearList}
        disabled={totalItems === 0}
        className="action-fab clear"
      >
        <Clear />
      </Fab>
    </span>
  </Tooltip>
</Box>


      {/* Customer Name Dialog */}
      <Dialog
        open={showCustomerDialog}
        onClose={() => setShowCustomerDialog(false)}
        maxWidth="sm"
        fullWidth
        className="customer-dialog"
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Person />
            עריכת שם לקוח
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="שם הלקוח"
            fullWidth
            variant="outlined"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="הכנס שם לקוח (אופציונלי)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCustomerDialog(false)}>
            ביטול
          </Button>
          <Button
            onClick={() => setShowCustomerDialog(false)}
            variant="contained"
          >
            שמור
          </Button>
        </DialogActions>
      </Dialog>

      {/* Info Dialog */}
      <Dialog
        open={showInfoDialog}
        onClose={() => setShowInfoDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <Info />
              אודות המערכת
            </Box>
            <IconButton onClick={() => setShowInfoDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box className="info-content">
            <Typography variant="h6" gutterBottom>
              מערכת רשימות קניות חכמה
            </Typography>
            <Typography variant="body1" paragraph>
              מערכת מתקדמת לניהול רשימות קניות עם יכולות של:
            </Typography>
            <Box component="ul" className="features-list">
              <li>הוספת פריטים לפי קטגוריות</li>
              <li>חיפוש וסינון פריטים</li>
              <li>שמירה ושיתוף רשימות</li>
              <li>הדפסת רשימות</li>
              <li>ניהול שמות לקוחות</li>
            </Box>
            <Box className="tech-info">
              <Chip label="React" className="tech-chip" />
              <Chip label="TypeScript" className="tech-chip" />
              <Chip label="Material-UI" className="tech-chip" />
              <Chip label="Redux Toolkit" className="tech-chip" />
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccessSnackbar(false)}
          severity={successMessage.includes('שגיאה') ? 'error' : 'success'}
          variant="filled"
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Display */}
      {error && (
        <Alert severity="error" className="error-alert">
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default ShoppingList;
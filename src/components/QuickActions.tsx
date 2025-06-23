import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Fab,
  Tooltip
} from '@mui/material';
import {
  Save,
  Share,
  Print,
  Clear,
  Person,
  CheckCircle
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearCurrentList } from '../store/slices/shoppingListSlice';
import { completeOrder } from '../store/thunks/shoppingListThunks';
import './QuickActions.css';

const QuickActions: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, totalItems, isLoading } = useAppSelector(state => state.shoppingList);
  
  const [customerName, setCustomerName] = useState('');
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSaveList = async () => {
    if (items.length === 0) {
      setSuccessMessage('לא ניתן לשמור רשימה ריקה');
      setShowSuccessSnackbar(true);
      return;
    }

    try {
      await dispatch(completeOrder({ customerName: customerName.trim() || undefined })).unwrap();
      setSuccessMessage('הרשימה נשמרה בהצלחה!');
      setShowSuccessSnackbar(true);
      setCustomerName('');
    } catch (error) {
      console.error('Error saving list:', error);
      setSuccessMessage('שגיאה בשמירת הרשימה');
      setShowSuccessSnackbar(true);
    }
  };

  const handleClearList = () => {
    dispatch(clearCurrentList());
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

  return (
    <>
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
            <Button
              startIcon={<Person />}
              onClick={() => setShowCustomerDialog(true)}
              className="edit-customer-button"
              variant="outlined"
            >
              עריכה
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box className="action-buttons">
        <Tooltip title="שמור רשימה">
          <Fab
            color="primary"
            onClick={handleSaveList}
            disabled={isLoading || totalItems === 0}
            className="action-fab save"
          >
            <Save />
          </Fab>
        </Tooltip>
        
        <Tooltip title="שתף רשימה">
          <Fab
            color="secondary"
            onClick={handleShareList}
            disabled={totalItems === 0}
            className="action-fab share"
          >
            <Share />
          </Fab>
        </Tooltip>
        
        <Tooltip title="הדפס רשימה">
          <Fab
            onClick={handlePrintList}
            disabled={totalItems === 0}
            className="action-fab print"
          >
            <Print />
          </Fab>
        </Tooltip>
        
        <Tooltip title="נקה רשימה">
          <Fab
            onClick={handleClearList}
            disabled={totalItems === 0}
            className="action-fab clear"
          >
            <Clear />
          </Fab>
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
    </>
  );
};

export default QuickActions;
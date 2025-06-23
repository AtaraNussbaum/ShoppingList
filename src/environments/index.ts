// ייבוא סביבות
import { environment as devEnvironment } from './environment';
import { environment as prodEnvironment } from './environment.prod';

// בחירת סביבה לפי NODE_ENV
const getEnvironment = () => {
  // בדיקה אם זה build של פרודקשן
  if (process.env.NODE_ENV === 'production') {
    return prodEnvironment;
  } 
  
  // אחרת - סביבת פיתוח
  return devEnvironment;
};

// ייצוא הסביבה הנוכחית
export const environment = getEnvironment();

// ייצוא טיפוס לשימוש
export type Environment = typeof environment;
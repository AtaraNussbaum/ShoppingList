import React from "react";
import {
  Box,
  Typography,
  Container,
  Divider,
  Link,
  IconButton,
} from "@mui/material";
import { Copyright, Phone, Email, GitHub, LinkedIn } from "@mui/icons-material";
import "./Footer.css";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" className="app-footer">
      <Container maxWidth="lg">
        <Divider className="footer-divider" />

        <Box className="footer-content">
          {/* Main Copyright */}
          <Box className="copyright-section">
            <Box className="copyright-icon">
              <Copyright />
            </Box>
            <Typography variant="body1" className="copyright-text">
              <strong className="developer-name"> ATARA TACH</strong>
            </Typography>
          </Box>

          {/* Contact Info - Enhanced Version */}
          <Box className="contact-section">
            <Box className="contact-card">
            
              <Box className="contact-methods">
                <Box className="contact-method">
                  <Box className="contact-details">
                  
                    <Link 
                      href="tel:0583280005" 
                      className="contact-link phone-link"
                      underline="hover"
                    >
                      058-328-0005
                    </Link>
                  </Box>
                </Box>
                
                <Box className="contact-method">
                  <Box className="contact-details">
                  
                    <Link 
                      href="mailto:0583280005a@gmail.com" 
                      className="contact-link email-link"
                      underline="hover"
                    >
                      0583280005a@gmail.com
                    </Link>
                  </Box>
                </Box>
              </Box>
              
           
            </Box>
          </Box>

          {/* Social Links (אופציונלי) */}
          <Box className="social-section">
            <Typography variant="caption" className="social-label">
              עקבו אחרי:
            </Typography>
            <Box className="social-links">
              <IconButton
                size="small"
                className="social-button github"
                aria-label="GitHub"
              >
                <GitHub />
              </IconButton>
              <IconButton
                size="small"
                className="social-button linkedin"
                aria-label="LinkedIn"
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Additional Info */}
        <Box className="footer-bottom">
          <Typography variant="caption" className="footer-note">
            מערכת רשימות קניות חכמה • פותח בטכנולוגיות מתקדמות
          </Typography>
          <Box className="tech-stack">
            <span className="tech-badge">React</span>
            <span className="tech-badge">TypeScript</span>
            <span className="tech-badge">Material-UI</span>
            <span className="tech-badge">Redux Toolkit</span>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

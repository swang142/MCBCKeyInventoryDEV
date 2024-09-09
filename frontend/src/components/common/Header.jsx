import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Box, Button } from '@mui/material';
import './Header.css'; // CSS for header styling
import myIcon from '../../../public/churchIcon.png'; // Import custom icon
import { useIsAuthenticated, useSignOut, useAuthUser} from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { generateCode } from '../../../api/apicommunicator';

const Header = () => {
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();
  const auth = useAuthUser();
  const navigate = useNavigate();


  const logout = () => {
    signOut();
  }

  const showCode = async () => {
      const code = await generateCode(auth()?.username);
      toast.success("Your registration code is: " + code.data.authToken, { duration: 3000})
  }

  return (
    <AppBar position="static" className="app-bar"> {/* Header container */}
      <Toolbar className = "header">

      <div class="left-section">
          <a href="https://mcbc.com/" target="_blank" rel="noopener noreferrer"> {/* Link to external site */}
            <Box
              id="church-icon"
              component="img"
              alt="My Custom Icon"
              src={myIcon} 
            />  
          </a>
          <Typography className="title"> {/* Title text */}
            MCBC Key Inventory Software
          </Typography>
        </div>
        
        <div>
          {isAuthenticated() && <Button onClick={logout} className="header-button"> LOG OUT </Button>}
          {isAuthenticated() && <Button onClick={showCode} className="header-button"> Generate Code </Button>}

          {!isAuthenticated() && <Button onClick={() => {navigate('/login')}} className="header-button"> LOG IN</Button>}
          {!isAuthenticated() && <Button onClick={() => {navigate('/register')}} className="header-button"> REGISTER </Button>}
        </div>

      </Toolbar>
    </AppBar>
  );
};

export default Header; // Export component

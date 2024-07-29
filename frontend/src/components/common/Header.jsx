import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import myIcon from '../../../public/churchIcon.png'
import { Box, Icon } from '@mui/material';
import './Header.css';

const Header = () => {
  return (

    <AppBar position="static" className="app-bar">
      <Toolbar>
        <a href="https://mcbc.com/" target="_blank">
            <Box
                id= "church-icon"
                component="img"
                alt="My Custom Icon"
                src={myIcon}
            />  
        </a>
        <Typography className= 'title'>
          MCBC Key Inventory Software
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

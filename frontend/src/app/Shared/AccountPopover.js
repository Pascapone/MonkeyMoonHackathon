import * as React from 'react';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu'
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import LoginIcon from '@mui/icons-material/Login';


import { useMoralis } from "react-moralis";

const AccountPopover = ({ open, handleClose, anchorRef }) => {  
  const { isAuthenticated, user, account, logout } = useMoralis();
  
  const handleClickLogout = (e) => {
    logout()
    handleClose()
  }

  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorRef.current}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
      anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
      transformOrigin={{ vertical: 'top', horizontal: 'right'}}
    >
      <MenuList>       
        <MenuItem>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>          
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClickLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </MenuList>       
    </Menu>
  );
}

export default AccountPopover
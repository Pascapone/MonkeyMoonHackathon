import { useState } from 'react';

import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchiveIcon from '@mui/icons-material/Archive';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SupportIcon from '@mui/icons-material/Support';

import { BottomNavigation, BottomNavigationAction, IconButton, Box, Menu, MenuItem } from '@mui/material';

import { useNavigate } from 'react-router-dom';

const MobileNavigation = () => {

  const [bottomNavValue, setBottomNavValue] = useState(0)
  const [anchorEl, setAnchorEl] = useState(null)
  

  const navigate = useNavigate()

  const open = Boolean(anchorEl)

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = (e) => {
    console.log(e.currentTarget.value)
    setAnchorEl(null);
  };

  return (
    <>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleClose} value={0}>Games</MenuItem>
        <MenuItem onClick={handleClose} value={1}>Other</MenuItem>
      </Menu>

      <BottomNavigation
        showLabels
        value={bottomNavValue}
        onChange={(event, bottomNavValue) => {
          setBottomNavValue(bottomNavValue);
        }}
      >
        <BottomNavigationAction label="Home" onClick={() => navigate('/')} icon={<DashboardIcon />} />
        <BottomNavigationAction label="ICO" onClick={() => navigate('/ico')} icon={<ShoppingCartIcon />} />
        <BottomNavigationAction label="Vault" onClick={() => navigate('/vault')} icon={<SupportIcon />} />
        <BottomNavigationAction label="NFT" onClick={() => navigate('/nft')} icon={<ColorLensIcon />} />
        
      </BottomNavigation>
      <Box sx={{margin : 'auto', marginRight : 2}}>
        <IconButton onClick={handleClick}>
          <MoreVertIcon/>
        </IconButton>
      </Box>
    </>
  )
}

export default MobileNavigation
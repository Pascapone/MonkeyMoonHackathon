import './navbar.css'

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux'
import { setActiveSidebarItem, setActiveSidebarSubItem } from "../state/slices/controllSlice";

import { v4 as uuidv4 } from 'uuid';

import gsap from "gsap"

import {Box, Typography, MenuItem, Tooltip} from "@mui/material";
import Menu from '@mui/material/Menu';

import ClearIcon from '@mui/icons-material/Clear';

import { useTheme } from "@mui/material/styles";

import { useLocation } from 'react-router-dom'

const sidebarIconSize = 26;
const subMenuItemSize = 21;

const SidebarItem = ({children, route, sidebarOpen, category, materialIcon }) => { 

  const handleRef = useCallback((node) => { setSubMenu(node) }, [])
  const itemRef = useRef()
  
  const [subMenu, setSubMenu] = useState()

  const theme = useTheme()

  const location = useLocation()

  const activeSidebarItem = useSelector((state) => state.controll.activeSidebarItem)
  const activeSidebarSubItem = useSelector((state) => state.controll.activeSidebarSubItem)

  const darkMode  = useSelector((state) => state.controll.darkMode)

  let activeStyle 
  if(darkMode){
    activeStyle = {
      backgroundColor : theme.palette.background.paper, 
      borderRadius: '0 20px 20px 0', marginRight : 10
    }
  }
  else{
    activeStyle = {
      backgroundColor : theme.palette.grey[100], 
      borderRadius: '0 20px 20px 0', marginRight : 10
    }
  }



  const markerColor = darkMode ? theme.palette.secondary.light : theme.palette.secondary.main

  

  const [style, setStyle] = useState(category === activeSidebarItem ? activeStyle : {})
  const [childIds, setChildIds] = useState([])
  const [subHoverId, setSubHoverId] = useState(null)  
  const [anchorEl, setAnchorEl] = useState(null)

  const open = Boolean(anchorEl)
   
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleClick = (e, route) => {
    if(activeSidebarItem !== category){
      setSubHoverId(null)
      dispatch(setActiveSidebarSubItem(null))
    }

    if(route) navigate(route)      
    
    dispatch(setActiveSidebarItem(category))   
    
    if(children && !sidebarOpen){
      setAnchorEl(e.target)
    }
  }  

  const handleHover = () => {
    setStyle(activeStyle)
  }

  const handleLeave = () => {
    if(category !== activeSidebarItem){
      setStyle({})
    }
  }

  const handleHoverSub = (e, route) =>  setSubHoverId(route)

  const handleLeaveSub = () => setSubHoverId(null)

  const handleSubClick = (e, route) => { 
    if(route) navigate(route)

    dispatch(setActiveSidebarSubItem(route))
  }

  const handleMenuClicked = (e, route) => {
    setAnchorEl(null);

    if(route){
      navigate(route)
      dispatch(setActiveSidebarSubItem(route))
    }      
  }

  const handleCloseMenu = () => {
    gsap.to(itemRef.current, {duration : 0.3, marginRight : activeStyle.marginRight, borderRadius : activeStyle.borderRadius})
    setAnchorEl(null)
  } 

  useEffect(() => {
    if(children && children.length !== childIds.length){
      const ids = children.map( (child) => uuidv4() )   
    
      setChildIds(ids)
    }
  }, [children, childIds.length])

  useEffect(() => {
    if(category !== activeSidebarItem){
      setSubHoverId(null)
      setStyle({})
    }
  }, [activeSidebarItem, category])

  useEffect(() => {
    if(activeSidebarItem === category)
      gsap.to(itemRef.current, {duration : 0.3, borderRadius : 0, marginRight : -1})   
    
  }, [location, category, activeSidebarItem])

  useEffect(() => {     
    if(children && subMenu != null){
      if(activeSidebarItem === category){
        gsap.to(subMenu, {duration : 0.3, height : children.length * subMenuItemSize})
      }  
      else{
        gsap.to(subMenu, {duration : 0.3, height : 0})
      }    
    }
  }, [activeSidebarItem, category, children, sidebarOpen, subMenu])

  useEffect(() => {
    setStyle(category === activeSidebarItem ? 
      {backgroundColor : activeStyle.backgroundColor, borderRadius: '0 20px 20px 0', marginRight : 10}
       : 
       {}
    )  
  }, [theme, category, activeSidebarItem, activeStyle.backgroundColor])

  return(
    <>
      <Tooltip title={category} enterDelay={sidebarOpen ? 5000 : 100} leaveDelay={0} placement="right">
      <Box ref={itemRef}
        className="sidebar-item" 
        style={{...style, cursor: 'pointer'}} 
        onMouseOver={handleHover} 
        onMouseLeave={handleLeave} 
        onClick={(e) => handleClick(e, route)}
      >
        {category === activeSidebarItem ? 
          <div style={{height : '40px', width : '5px', backgroundColor: markerColor}}/>
          :
          <div style={{height : '40px', width : '5px'}}/>
        }
        {materialIcon ? React.cloneElement(materialIcon, 
          {...materialIcon.props, 
            className: "sidebar-icon", 
            sx: { fontSize: sidebarIconSize },
            pointerEvents : 'none'})
          :
          <ClearIcon/>
        }
        {sidebarOpen ? <Typography 
            alignSelf='center' 
            variant='h6' 
            fontWeight={darkMode ? 300 : 400} 
            fontSize={17}
            color={category === activeSidebarItem ? theme.palette.text.primary : theme.palette.text.secondary}                      
          >
            {category}
          </Typography> 
          : 
          <></>
        }                       
      </Box> 
      </Tooltip>
      {childIds.length && sidebarOpen ?   
        <Box ref={handleRef} style={{marginLeft : 58, height : 0, overflowY : 'hidden'}}>
          {children.map((child, index) => (       
            <div key={childIds[index]} style={{cursor: 'pointer'}}>     
            {React.cloneElement(child, 
              {...child.props,                 
                id : child.props.route,
                key : childIds[index] + 'text',
                display: 'block', 
                alignSelf: 'center', 
                variant: 'p', 
                fontWeight: darkMode ? 300 : 400,
                fontSize: 14,
                color: subHoverId === child.props.route || activeSidebarSubItem === child.props.route ? theme.palette.text.primary : theme.palette.text.secondary,
                onMouseEnter: (e) => handleHoverSub(e, child.props.route),
                onMouseLeave: handleLeaveSub,
                onClick: (e) => handleSubClick(e, child.props.route),
                }) 
              }
            </div>
          ))} 
        </Box>
        :
        <div>
        {category === activeSidebarItem && childIds.length && !sidebarOpen ? 
          <Menu
            id="submenu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}   
            transitionDuration={400}         
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            PaperProps={{
              style: {               
                transform: 'translateX(11px)',
                backgroundColor: theme.palette.background.paper,                
              },
              elevation : 0
            }}
          >
          {children.map((child, index) => (
            <MenuItem key={index} onClick={(e) => handleMenuClicked(e, child.props.route)}>{child.props.children}</MenuItem>
           
          ))}
          </Menu>
          :
          <></>
        }
        </div>
      }
    </>
  )
}

export default SidebarItem;
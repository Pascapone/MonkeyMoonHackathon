import React from 'react'
import { Dialog, Typography, Grid, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { connectors } from './config';
import { useMoralis } from "react-moralis";
import { useState, useEffect, useCallback } from 'react';

const WalletsModal = ({open, handleClose}) => {
  const [openModal, setOpenModal] = useState(false)
  const { authenticate, isAuthenticated, user } = useMoralis();

  const handleConnect = async (connectorId) => {    
    connect(connectorId, true)
  }

  const handleCloseModal = () => {
    handleClose()
    setOpenModal(false)
  }  

  const connect = useCallback(async (connectorId, cacheProvider) => {
    await authenticate({provider : connectorId})
    if(cacheProvider){
      localStorage.setItem("connectorId", connectorId)
      setOpenModal(false)
    }    
    handleClose()
  }, [authenticate, handleClose])

  useEffect(() => {    

    if(open){
      const connectorId = localStorage.getItem("connectorId")
      if(connectorId){
        connect(connectorId)
      }
      else{
        setOpenModal(open)
      }  
    }
  }, [open, connect, handleClose])

  return (
    <div>
      <Dialog onClose={handleCloseModal} open={openModal}>
          <Grid container>
            <Grid item xs={2}>
            </Grid>
            <Grid item xs={8} style={{textAlign : 'center', marginTop : 8}}>
              <div>
                <Typography variant='h6'>Connect Wallet</Typography>
              </div>
            </Grid>
          <Grid item xs={2} style={{textAlign : 'end'}}>
          <IconButton onClick={handleCloseModal} style={{width : 30, height : 30, marginTop : 3, marginRight : 3}}>
            <CloseIcon />
          </IconButton>           
          </Grid>
          </Grid>
        <Grid container width={280} margin='15px'>
        {connectors.map(({icon, title, connectorId}, index) =>(
          <Grid item xs={6} style={{textAlign : 'center', padding : 4, marginBottom : 20}}>
            <div onClick={() => handleConnect(connectorId)} style={{height : 55, marginBottom : 0, cursor : 'pointer'}}>
              <img src={icon} alt={title} style={{width : 50}} />
            </div>
            <Typography variant='body2'>{title}</Typography>
          </Grid>
        ))}
        </Grid>
      </Dialog>      
    </div>
  )
}

export default WalletsModal

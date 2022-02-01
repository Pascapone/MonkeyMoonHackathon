import { useState, forwardRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

import { Accordion, AccordionDetails, AccordionSummary, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from "@mui/material";
import { useMoralis } from 'react-moralis';

import { removeOtherTelegramLinks } from '../database/database'

import ReactMarkdown from 'react-markdown'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function NotificationDialog({ open, handleClose, notifications, setNotifications }) {

  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)
  const { web3, Moralis, account, user } = useMoralis()

  const signMessage = async (notification) => {
    const signMessage = await notification.get('signMessage')
    console.log(signMessage)

    const signer = web3.getSigner()
    console.log(signer)
    console.log(signMessage.get('message'))

    if(signMessage.get('subject') === "Telegram Link"){
      const signature = await signer.signMessage(signMessage.get('message'))

      const telegramUser = notification.get('telegramUser')
      console.log(telegramUser.id)
      const params =  { signature, telegramUserId : telegramUser.id };    
      const signed = await Moralis.Cloud.run("confirmTelegram", params);

      if(signed){

        await removeOtherTelegramLinks(Moralis, signMessage.get("telegramUser"), account, user)
        const notificationsCopy = [...notifications]
        let index = notificationsCopy.indexOf(notification)

        if (index > -1) {
          notificationsCopy[index].get("signMessage").set("signed", true)
          setNotifications(notificationsCopy)
        }
      }
      else{
        console.log("Failed to sign")
      }
    }    
  }

  const handleDelete = (notification) => {
    const notificationsCopy = [...notifications]
    let index = notificationsCopy.indexOf(notification)

    if (index > -1) {
      notificationsCopy.pop(index);
      setNotifications(notificationsCopy)
    }

    const signMessage = notification.get('signMessage')
    if(signMessage && !signMessage.get('signed')){
      signMessage.destroy()
    }
    
    notification.destroy()
  }

  const handleOpenMessage = async (isExpanded, notification, index) => {
    setExpanded(isExpanded ? index : false)
    if(notification && !notification.get('opened')){ 
      notification.set('opened', true)
      notification.save()  

      const notificationsCopy = [...notifications]
      let index = notificationsCopy.indexOf(notification)

      if (index > -1) {
        notificationsCopy[index] = notification
        setNotifications(notificationsCopy)
      }

    }    
  }

  const handleCloseDialog = () => {
    setExpanded(false)
    handleClose()
  }

  return (
    <div>     
      <Dialog
        fullScreen
        open={open}
        onClose={handleCloseDialog}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseDialog}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Notifications
            </Typography>
          </Toolbar>
        </AppBar>
        <List>

          {notifications.map((notification, index) => (       
            <Accordion key={uuidv4()} expanded={expanded === index} onChange={(e, isExpanded) => handleOpenMessage(isExpanded, notification, index)}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1a-header"                                
              >
                <Typography color={notification.get('opened') ? theme.palette.text.main : theme.palette.success.main}>{notification.get('subject')}</Typography>                
              </AccordionSummary>
              <AccordionDetails>
                {notification.get('image') &&
                  <Box sx={{maxWidth : 100, margin : 2, ml : 3}}>
                    <img style={{width : '100%'}} src={notification.get('image')} alt='Not Found'></img>
                  </Box>
                }
                <Typography component={'div'} maxWidth={600} sx={{ml : 1}}>
                  <ReactMarkdown components={{h4 : ({node, ...props}) => <h4 style={{color: theme.palette.success.main}} {...props} />}}>
                    {notification.get('text')}
                  </ReactMarkdown>                  
                </Typography>      
                <Typography maxWidth={600} color='error' sx={{ml : 1}}>
                  {notification.get('warning') ?? ''}
                </Typography>
                {notification.get('type') == 'sign' && 
                  (!notification.get('signMessage').get('signed') ?
                    <Button onClick={(e) => signMessage(notification)}>Sign</Button>
                    :
                    <Button disabled={true}>Signed</Button>
                  )
                } 
                <Button onClick={(e) => handleDelete(notification)}>Delete</Button> 
              </AccordionDetails>
            </Accordion>      
          ))}          
        </List>
      </Dialog>
    </div>
  );
}
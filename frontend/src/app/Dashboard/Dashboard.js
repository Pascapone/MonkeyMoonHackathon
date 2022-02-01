import { useTheme } from "@mui/material";
import Grid from '@mui/material/Grid';

import floatingMonkeyImage from '../../assets/images/mm_w__float_helmet2.png'

import { Typography, Button, Box, Chip } from "@mui/material";

import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { motion } from 'framer-motion' 

import { toast } from 'react-toastify';

import { useSelector } from "react-redux";

import DashboardCard from "../Cards/DashboardCard";

import { copiedToClipboardEvent } from "../Shared/events";

import { useEffect, useState } from "react";

import { useMoralis } from 'react-moralis'
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import NumberCard from '../Cards/NumberCard'

import { getMonkeyScore } from '../web3/web3MonkeyMoon'

const Dashboard = () => {
  const [monkeyScore, setMonkeyScore] = useState(0)

  const theme = useTheme()

  const { web3 } = useMoralis()

  const monkeyMoonAddress = useSelector(state => state.monkeyMoon.address)

  const handleTokenAddressClick = () => {
    navigator.clipboard.writeText(monkeyMoonAddress)
    document.dispatchEvent(copiedToClipboardEvent)
  }

  const floatingMonkeyTransition = {
    type: "spring",
    damping: 10,
    stiffness: 100,
    repeat: Infinity, 
    duration: 4
  }

  const loadScore = async () => {
    const score = await getMonkeyScore(web3)
    setMonkeyScore(score)
  }

  useEffect(() => {
    loadScore()
  }, []);

  
  

  return(
    <>       
      <Box sx={{width : '100%'}}>
        <Grid container spacing={2} rowSpacing={2}>        
          <Grid item xs={12} sm={12} md={12} lg={4} sx={{height : 140}}>
            <motion.div drag dragConstraints={{ left: -20, right: 20, top:-20, bottom: 20 }} className="topLayer" onClick={(e) => e.preventDefault()}>
              <motion.div initial={{y : 0}} transition={floatingMonkeyTransition} animate={{y : [0, -10, 0]}}>
                <img src={floatingMonkeyImage} alt="floating-monkey" onDragStart={(e) => e.preventDefault()} style={{margin : 'auto', display : 'block', marginTop : 20, width : 100}}/>
              </motion.div>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={4} sx={{height : 120}}>
              <Box style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection : 'column'}}>
              <Typography variant="h3" textAlign={'center'} style={{marginBottom : 10, marginTop : 0}}>
                Dashboard
              </Typography>
              <Button variant="outlined" color="secondary" size='small' startIcon={<ContentCopyIcon />} onClick={handleTokenAddressClick}>
                Token Address
              </Button> 
            </Box>         
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={4} sx={{height : 0}}>          
          </Grid>  
          <Grid item xs={12} sm={12} md={6} lg={4}>
              <NumberCard 
                title={"Your Monkey Score"} 
                subtitle={"Your total Monkey Score that you already claimed"} 
                icon={<MilitaryTechIcon style={{color : theme.palette.text.secondary, fontSize : 40}}/>}
                value={`${monkeyScore} Monkey Score`}                
              />
            </Grid>        
        </Grid>
      </Box>
    </>
  )
}

export default Dashboard;
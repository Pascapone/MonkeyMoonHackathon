import { Card, CardContent, Typography, Paper } from "@mui/material";
import { CardHeader, Box, LinearProgress, } from "@mui/material";

import { useEffect, useState, useCallback } from "react";


import { useTheme } from "@mui/material";

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24
const MILLISECONDS_IN_HOUR = 1000 * 60 * 60
const MILLISECONDS_IN_MINUTE = 1000 * 60

const timeTypoVariant = 'h4'
const timeTypoMargin = 5
const timeTypoUnitFontSize = 8
const timeTypoUnitVariant = 'body2'
const timeTypoUnitColor = 'white'

const timeTypoVariantSm = 'h6'
const timeTypoMarginSm = 4
const timeTypoUnitFontSizeSm = 6

const TimerCard = ({icon, title, subtitle, startTimestamp, endTimestamp, onComplete, running}) => {
  const theme = useTheme();  

  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState({days : 0, hours : 0, minutes : 0, secconds : 0})

  const calculateProgress =  useCallback(() => {
    const now = Date.now()

    if(now < startTimestamp){
      return setProgress(0)
    }
    else if(now > endTimestamp && running){
      if(onComplete) onComplete()
      return setProgress(100)
    }
    
    setProgress((1 - (endTimestamp - now)/(endTimestamp - startTimestamp))*100)  
  }, [setProgress, endTimestamp, startTimestamp, onComplete])

 
  const calculateTimeLeft = useCallback(() => {
    const now = Date.now()

    if(now > endTimestamp){
      return 0
    }
    return endTimestamp - now
  },[endTimestamp])

  const numberToClockString = (number, limit = true, minLenght = 2) => {
    const stringNumber = number.toString()
    if(limit){
      return stringNumber.length >= minLenght ? stringNumber.substring(0, minLenght) : `${0}${stringNumber}`
    }
    return stringNumber.length >= minLenght ? stringNumber : `${0}${stringNumber}`
  }

  const timeLeft2String = useCallback(() => {
    const time = calculateTimeLeft()
    let remainder
    const days = numberToClockString(Math.floor(time / MILLISECONDS_IN_DAY), false, 1)
    remainder = time % MILLISECONDS_IN_DAY
    const hours = numberToClockString(Math.floor(remainder / MILLISECONDS_IN_HOUR), false)
    remainder = time % MILLISECONDS_IN_HOUR
    const minutes = numberToClockString(Math.floor(remainder / MILLISECONDS_IN_MINUTE))
    const secconds = numberToClockString(Math.floor((remainder % MILLISECONDS_IN_MINUTE) / 1000)) 
    
    setTimeLeft({days, hours, minutes, secconds})
  },[calculateTimeLeft, setTimeLeft])


  useEffect(() => {    
    const timer = window.setInterval(() => {     
      calculateProgress()
      calculateTimeLeft()
      timeLeft2String()
    }, 1000);  
    return () => window.clearInterval(timer);
  }, [calculateProgress, calculateTimeLeft, timeLeft2String])

  return(
    <Card sx={{margin : 2, borderRadius : 0, height : '100%'}}>          
          <CardHeader 
            title={title}
            titleTypographyProps={{sx : {fontSize : 16}}}
            subheaderTypographyProps={{sx : {fontSize : 12}}}
            subheader={subtitle}
          />    
          <CardContent sx={{height : 150, marginTop : -1}}>   
            <Box display={'flex'} alignItems={'center'}>
              <Box sx={{minWidth: "100%", marginTop : 1}}>
                <LinearProgress variant="determinate" value={progress} sx={{height : 10}}/>
              </Box>      
              
            </Box>
            <Box display={'flex'} alignItems={'center'} sx={{marginTop : 3}} style={{position : 'relative'}}>
              <Paper            
                elevation={1} 
                style={{
                  width: "-webkit-fit-content", 
                  padding : 15, 
                  paddingLeft : 40, 
                  paddingRight : 40, 
                  backgroundImage: (
                    theme.palette.mode === 'light' ?
                    `linear-gradient(to bottom right, ${theme.palette.primary.dark}, ${theme.palette.primary.light})`
                    :
                    `linear-gradient(to bottom right, ${theme.palette.primary.dark}, ${theme.palette.primary.light})`
                  )
                }}
                sx={{
                  display : {xs : 'none', sm : 'flex'}
                }}
              >             
                <Box>
                  <Typography color={timeTypoUnitColor} variant={timeTypoVariant} style={{marginRight : timeTypoMargin}}>
                    {timeLeft.days}
                  </Typography>
                  <Typography color={timeTypoUnitColor} textAlign={'center'} variant={timeTypoUnitVariant} sx={{fontSize : timeTypoUnitFontSize}} style={{marginRight : timeTypoMargin}}>
                    DAYS
                  </Typography>
                </Box>
                <Typography color={timeTypoUnitColor} variant={timeTypoVariant} style={{marginRight : timeTypoMargin}}>
                  :
                </Typography>
                <Box>
                  <Typography color={timeTypoUnitColor} variant={timeTypoVariant} style={{marginRight : timeTypoMargin}}>
                    {timeLeft.hours}
                  </Typography>
                  <Typography color={timeTypoUnitColor} textAlign={'center'} variant={timeTypoUnitVariant} sx={{fontSize : timeTypoUnitFontSize}} style={{marginRight : timeTypoMargin}}>
                    HOURS
                  </Typography>
                </Box>
                <Typography color={timeTypoUnitColor} variant={timeTypoVariant} style={{marginRight : timeTypoMargin}}>
                  :
                </Typography>
                <Box>
                  <Typography color={timeTypoUnitColor} variant={timeTypoVariant} style={{marginRight : timeTypoMargin}}>
                    {timeLeft.minutes}
                  </Typography>
                  <Typography color={timeTypoUnitColor} textAlign={'center'} variant={timeTypoUnitVariant} sx={{fontSize : timeTypoUnitFontSize}} style={{marginRight : timeTypoMargin}}>
                    MINUTES
                  </Typography>
                </Box>
                <Typography color={timeTypoUnitColor} variant={timeTypoVariant} style={{marginRight : timeTypoMargin}}>
                    :
                </Typography>
                <Box>
                  <Typography color={timeTypoUnitColor} variant={timeTypoVariant} style={{marginRight : timeTypoMargin}}>
                    {timeLeft.secconds}
                  </Typography>
                  <Typography color={timeTypoUnitColor} textAlign={'center'} variant={timeTypoUnitVariant} sx={{fontSize : timeTypoUnitFontSize}} style={{marginRight : timeTypoMargin}}>
                    SECCONDS
                  </Typography>
                </Box>
              </Paper>
              <Paper            
                elevation={1} 
                style={{                  
                  width: "-webkit-fit-content", 
                  padding : 15, 
                  paddingLeft : 15, 
                  paddingRight : 15, 
                  backgroundImage: (
                    theme.palette.mode === 'light' ?
                    `linear-gradient(to bottom right, ${theme.palette.primary.dark}, ${theme.palette.primary.light})`
                    :
                    `linear-gradient(to bottom right, ${theme.palette.primary.dark}, ${theme.palette.primary.light})`
                  )
                }}
                sx={{
                  display : {xs : 'flex', sm : 'none'}
                }}
              >             
                <Box>
                  <Typography color={timeTypoUnitColor} variant={timeTypoVariantSm} style={{marginRight : timeTypoMarginSm}}>
                    {timeLeft.days}
                  </Typography>
                  <Typography color={timeTypoUnitColor} textAlign={'center'} variant={timeTypoUnitVariant} sx={{fontSize : timeTypoUnitFontSizeSm}} style={{marginRight : timeTypoMarginSm}}>
                    DAYS
                  </Typography>
                </Box>
                <Typography color={timeTypoUnitColor} variant={timeTypoVariantSm} style={{marginRight : timeTypoMarginSm}}>
                  :
                </Typography>
                <Box>
                  <Typography color={timeTypoUnitColor} variant={timeTypoVariantSm} style={{marginRight : timeTypoMarginSm}}>
                    {timeLeft.hours}
                  </Typography>
                  <Typography color={timeTypoUnitColor} textAlign={'center'} variant={timeTypoUnitVariant} sx={{fontSize : timeTypoUnitFontSizeSm}} style={{marginRight : timeTypoMarginSm}}>
                    HOURS
                  </Typography>
                </Box>
                <Typography color={timeTypoUnitColor} variant={timeTypoVariantSm} style={{marginRight : timeTypoMarginSm}}>
                  :
                </Typography>
                <Box>
                  <Typography color={timeTypoUnitColor} variant={timeTypoVariantSm} style={{marginRight : timeTypoMarginSm}}>
                    {timeLeft.minutes}
                  </Typography>
                  <Typography color={timeTypoUnitColor} textAlign={'center'} variant={timeTypoUnitVariant} sx={{fontSize : timeTypoUnitFontSizeSm}} style={{marginRight : timeTypoMarginSm}}>
                    MINUTES
                  </Typography>
                </Box>
                <Typography color={timeTypoUnitColor} variant={timeTypoVariantSm} style={{marginRight : timeTypoMarginSm}}>
                    :
                </Typography>
                <Box>
                  <Typography color={timeTypoUnitColor} variant={timeTypoVariantSm} style={{marginRight : timeTypoMarginSm}}>
                    {timeLeft.secconds}
                  </Typography>
                  <Typography color={timeTypoUnitColor} textAlign={'center'} variant={timeTypoUnitVariant} sx={{fontSize : timeTypoUnitFontSizeSm}} style={{marginRight : timeTypoMarginSm}}>
                    SECCONDS
                  </Typography>
                </Box>
              </Paper>
              <Box  justifyContent={'flex-end'} sx={{width : '100%', display : {xs : 'none', sm : 'flex'}}}>                
                {icon}                   
              </Box>
            </Box>
          </CardContent>                   
        </Card>
  )
}

export default TimerCard
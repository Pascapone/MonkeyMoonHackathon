import { Button, Card, CardContent, Typography } from "@mui/material";
import { CardHeader, InputAdornment, Stack, Box, TextField, Slider, Link } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { Avatar } from "@mui/material";

import { useState, useRef, useEffect } from "react";

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import ProgressButton from "../styled/ProgressButton";

import { useTheme } from "@mui/material";

import { styled } from '@mui/material';
import { StepConnector, stepConnectorClasses } from '@mui/material';

import { useSelector, useDispatch } from "react-redux";

import { buyTokens, loadIcoData } from "../web3/web3Ico";

import gsap from "gsap";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

import { setActiveSidebarItem } from "../state/slices/controllSlice";

import { useMoralis } from "react-moralis";
import { getWhitelistStatus } from "../database/database";

const gradientTime = 0.2

const steps = ['Select Amount', 'Confirm Transaction', 'Await Confirmation', "Completed"];

const QontoConnector = styled(StepConnector)(({ theme }) => ({   
  [`& .${stepConnectorClasses.line}`]: {
    background: `linear-gradient(90deg, rgba(154,154,154,1) 0%, rgba(154,154,154,1) 100%);`,
    borderWidth: "0px",
    height : '3px',
  },
}));

const MonkeyIcoCard = ({icon, text, title, subtitle, minValue, maxValue, step, price}) => {
  const [value, setValue] = useState(0.1)  

  const dispatch = useDispatch()

  const connectorRefs = useRef([])

  const [activeStep, setActiveStep] = useState(0);

  const [failedStep, setFailedStep] = useState(null)

  const [transactionHash, setTransactionHash] = useState(null)

  const navigate = useNavigate()

  const theme = useTheme()

  const { web3, Moralis } = useMoralis()

  const background1 = `linear-gradient(90deg, rgba(154,154,154,1) 0%, rgba(154,154,154,1) 100%)`
  const background2 = `linear-gradient(90deg, ${theme.palette.primary.main} 0%, rgba(154,154,154,1) 100%)`
  const background3 = `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.main} 100%)`

  const backgroundFailed1 = `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.error.main} 100%)`
  const backgroundFailed2 = `linear-gradient(90deg, ${theme.palette.error.main} 0%, ${theme.palette.error.main} 100%)`

  const TransferToVaultToast = ({ closeToast, toastProps }) => (
    <div>     
      {"Tokens have been successfully transfered to your "} 
      <Link color='secondary' onClick={() => {
          navigate('/vault')
          dispatch(setActiveSidebarItem('Vault'))
        }}
      > 
        vault
      </Link>
    </div>
  )

  const notifyTransferToVault = () => {
    toast.success(<TransferToVaultToast />, {
      theme: theme.palette.mode,
      autoClose : 6000
    }) 
  }


  const NotWhitlistedToast = ({ closeToast, toastProps }) => (
    <div>   
      <div> 
        You are not whitelisted for the ICO. Join our telegram group and talk to the monkey to get whitelisted.
      </div> 
      <Link color='secondary' onClick={() => {
          window.open(process.env.REACT_APP_PUBLIC_INVITE_LINK, '_blank')
        }}
      > 
        monkey moon telegram
      </Link>
    </div>
  )

  const notifyNotWhitlistedToast = () => {
    toast.warning(<NotWhitlistedToast />, {
      theme: theme.palette.mode,
      autoClose : 6000
    }) 
  }


  const handleTextFieldChange = (e) => {    
    setValue(e.target.value)
  }

  const handleSliderChange =  (e) => {
    setValue(e.target.value)
  }

  const handleTextFieldLoseFocus = (e) => {
    const number = Number(e.target.value)
    if(number > maxValue){
      setValue(maxValue)
    }
    else if(number < minValue){
      setValue(minValue)
    }
  }

  const isStepFailed = (index) => {
    if(index === failedStep){
      return true
    }
    else{
      return false
    }
  }

  const animateStep = (b1, b2, b3, step) => {
    try {
      gsap.fromTo(connectorRefs.current[step].children[0], {'background-image': b1}, {ease: "none", duration: gradientTime, 'background-image': b2});
      gsap.fromTo(connectorRefs.current[step].children[0], {'background-image': b2}, {ease: "none", duration: gradientTime, 'background-image': b3, delay : gradientTime});
    } catch (error) {
      console.log("Error from animate step")
      console.log(error)
    }
  }

  const refCallback = (el) => {
    if(!connectorRefs.current.includes(el))
      connectorRefs.current.push(el)
  }

  const onSend = (receipt) => {
    animateStep(background1, background2, background3, 1)
    setActiveStep(2)
    setTransactionHash(receipt.hash)
    console.log("Receipt", receipt)
  }

  const onConfirmation = () => {
    animateStep(background1, background2, background3, 2)
    setActiveStep(3)
    loadIcoData()
    gsap.to({}, {duration : 0.8, onComplete : delayedConfirmStep})
  }

  const delayedConfirmStep = () => {
    animateStep(background1, background2, background3, 3)
    notifyTransferToVault()
    setActiveStep(4)
  }

  const onError = () => {
    animateStep(background3, backgroundFailed1, backgroundFailed2, activeStep) 
    setFailedStep(activeStep + 1)
    setActiveStep(0)
  }

  const handleClickBuy = async () => {
    setFailedStep(null)
    setActiveStep(1)
    animateStep(background1, background2, background3, activeStep)

    const whitelisted = await getWhitelistStatus(Moralis)

    if(whitelisted){
      buyTokens(value, onSend, onConfirmation, onError, web3)
    }
    else{
      animateStep(background3, backgroundFailed1, backgroundFailed2, activeStep) 
      setFailedStep(activeStep + 1)
      setActiveStep(0)
      notifyNotWhitlistedToast()
    }    
  }

  const handleReset = () => {
    console.log("Reset")    
    connectorRefs.current.forEach(element => {
      if(element)
        element.children[0].style['background-image'] = background1
    });
    setTransactionHash(null)
    setActiveStep(0)
    setFailedStep(null)
  }

  useEffect(() => {   
    return () => {
    }
  })

  return(
    <Card sx={{margin : 2, borderRadius : 0, overflow : 'visible', display : {xs : 'none', sm : 'block'}}}>          
          <CardHeader 
            title={title}
            titleTypographyProps={{sx : {fontSize : 16}}}
            subheaderTypographyProps={{sx : {fontSize : 12}}}
            subheader={subtitle}
          />    
          <CardContent sx={{height : 420, marginTop : -1, overflow : 'visible'}}>   
            <Box display={'flex'} alignItems={'center'}>
              <Box sx={{minWidth: "75%", marginRight : 2}}>
                <Typography className="four-line-clamp" variant="body1" color="text.secondary">                
                  {text}               
                </Typography>                      
              </Box>      
              <Box display={'flex'} justifyContent={'flex-end'} sx={{width : '100%'}}>
                {icon}
              </Box>
            </Box>
            <Stack direction="row" alignItems={'center'} marginTop={2}>            
              <Typography variant='h6'>
                {value.toFixed(2)} AVAX
              </Typography>
              <Box style={{
                display : 'flex', 
                flexDirection : 'column', 
                textAlign : 'center', 
                marginBottom : 18, 
                fontSize : 12, 
                marginRight : 20, 
                marginLeft : 20}}
              >
                {price} AVAX
                <ArrowForwardIcon sx={{marginRight : 2, marginLeft : 2, alignSelf : 'center'}}/>
              </Box>
              <Typography  variant='h6' >
                {(value/price).toFixed(1)} MMC
              </Typography>
            </Stack>
            <Stack direction="row" alignItems={'center'} marginTop={2}>
              <Slider defaultValue={50} 
                value={value}
                aria-label="Default" 
                valueLabelDisplay="auto" 
                sx={{width : '50%', marginRight : 10}}
                min={minValue}
                max={maxValue}
                step={step}
                onChange={handleSliderChange}
              />
              <TextField
                label="Buy MMC"
                id="outlined-start-adornment"
                value={value}
                sx={{ m: 1, width: '25ch'}}
                InputProps={{
                  endAdornment: <InputAdornment position="start">AVAX</InputAdornment>, 
                }}
                inputProps={{
                  min : minValue.toString(),
                  max : maxValue.toString(),
                  step : step.toString() 
                }}
                type={'number'}
                onChange={handleTextFieldChange}    
                onBlur={handleTextFieldLoseFocus}            
              />
            </Stack>            
            <Stepper connector={<QontoConnector ref={(el) => refCallback(el)} />} activeStep={activeStep} sx={{marginTop : 4, height : 50}}>
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                if (isStepFailed(index)) {
                  labelProps.optional = (
                    <Typography variant="caption" color="error">
                      Failed!
                    </Typography>
                  );      
                  labelProps.error = true;
                }
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <Stack direction="row" alignItems={'center'} marginTop={4}>
              <ProgressButton 
                steps={steps}                 
                onClick={handleClickBuy}
                activeStep={activeStep}
                failed={failedStep !== null}
                completed={activeStep === 3}
                onReset={handleReset}
              /> 
                {transactionHash &&
                  <Button style={{fontSize : 10}}
                   variant="outlined" 
                   onClick={()=> window.open(`https://bscscan.com/tx/${transactionHash}`, "_blank")}
                  >
                    <Avatar sx={{ bgcolor: theme.palette.primary.main, marginLeft : -1, marginTop : 0 }} sizes="small">Tx</Avatar>
                    <Typography marginLeft={2}>
                      Transaction Hash
                    </Typography>                  
                  </Button> 
                }  
            </Stack>
          </CardContent>                   
        </Card>
  )
}

export default MonkeyIcoCard
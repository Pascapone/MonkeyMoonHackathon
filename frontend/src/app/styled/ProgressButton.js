import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import { useTheme } from '@mui/material';


export default function ProgressButton({steps, onClick, activeStep, failed, completed, onReset}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const theme = useTheme()

  const buttonSuccessSx = {
    ...(success && {
      bgcolor: theme.palette.success.main,
      '&:hover': {
        bgcolor: theme.palette.success.dark,
      },
    }),
  };  

  const handleButtonClick = () => {
    if (!loading && !success) {
      setSuccess(false)
      setLoading(true)

      if(onClick) onClick()
    }
    else if(success){
      setSuccess(false)
      if(onReset) onReset()
    }
  }; 

  useEffect(() => {    
    if(failed){
      setLoading(false)
      setSuccess(false)
    }
    else if(completed){
      setLoading(false)
      setSuccess(true)      
    }
  }, [failed, completed])



  return (
    <Box sx={{ display: 'flex', alignItems: 'center', marginTop : {xs : 25, sm : -5}, marginBottom : -5}}>
      <Box sx={{ m: 1, position: 'relative' }}>
        <Fab
          aria-label="save"
          color="primary"
          sx={{...buttonSuccessSx, display : {xs : 'none', sm : 'block'}}}
          onClick={success ? () => {} : handleButtonClick}
          disableRipple={success}
          disabled={loading}          
        >
          {success ? <CheckIcon /> : <SaveIcon />}
        </Fab>
        <Fab
          aria-label="save"
          color="primary"
          sx={{...buttonSuccessSx, display : {xs : 'block', sm : 'none'}}}
          onClick={success ? () => {} : handleButtonClick}
          disableRipple={success}
          disabled={loading}   
          size='small'       
        >
          {success ? <CheckIcon fontSize='small' sx={{marginTop : 1}}/> : <SaveIcon fontSize='small' sx={{marginTop : 1}}/>}
        </Fab>
        {loading && (
          <>
            <CircularProgress
              size={68}
              sx={{
                color: green[500],
                position: 'absolute',
                top: -6,
                left: -6,
                zIndex: 1,
                display : {xs : 'none', sm : 'block'}
              }}
            />
            <CircularProgress
              size={52}
              sx={{
                color: green[500],
                position: 'absolute',
                top: -6,
                left: -6,
                zIndex: 1,
                display : {xs : 'block', sm : 'none'}
              }}
            />
          </>
        )}
      </Box>
      <Box sx={{ m: 1, position: 'relative', ml : 0 }}>
        <Button
          variant="contained"
          sx={buttonSuccessSx}
          onClick={handleButtonClick}
          disabled={loading}
        >
          {activeStep === 0 ? "Buy Monkey Moon" : steps[Math.min(activeStep, steps.length - 1)]}
        </Button>      
      </Box>
    </Box>
  );
}
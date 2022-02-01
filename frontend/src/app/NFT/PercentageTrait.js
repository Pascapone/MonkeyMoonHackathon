import { Box, Typography, CircularProgress, Fab } from "@mui/material"
import { useTheme } from "@mui/material"
import CheckIcon from '@mui/icons-material/Check'

const PercentageTrait = ({ traitName, traitValue, onRemoveTrait }) => { 
  const theme = useTheme()

  if(traitValue > 100){
    traitValue = 100
  }
  else if (traitValue < 0){
    traitValue = 0
  }
  else{
    traitValue = traitValue
  }

  return (
    <>     
      <Box sx={{display: "inline-block", padding : 1, paddingTop : 1}}>
        <Typography variant="body2" textAlign='center' style={{paddingBottom : 5}} noWrap>{traitName}</Typography>
        <Box sx={{padding : 1, paddingTop : 1, position : 'relative', width : 72, margin : 'auto'}}>
          <CircularProgress color="success" variant="determinate" value={traitValue} style={{position : 'absolute', width : 64, top : 17, right : 16, zIndex : 6}}/>  
          <CircularProgress variant="determinate" value={100} style={{position : 'absolute', width : 64, top : 17, right : 16, color : theme.palette.grey[600], zIndex : 5}}/> 
          <Box sx={{backgroundColor : theme.palette.primary.main, borderRadius : '50%', width : 56, height : 56, position : 'relative'}}>          
            <Typography variant="body2" textAlign={'center'} style={{paddingTop : 18}}>{`${traitValue}%`}</Typography>
          </Box> 
        </Box>
        
           
               
      </Box>    
    </>
  )
}

export default PercentageTrait
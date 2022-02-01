import { Box, Typography } from "@mui/material"
import { useTheme } from "@mui/material"

const NumericTrait = ({ traitName, traitValue, onRemoveTrait }) => { 
  const theme = useTheme()

  if(traitValue >= 100000){
    traitValue = "+99999"
  }

  return (
    <>     
      <Box sx={{display: "inline-block", padding : 1, paddingTop : 1}}>
        <Typography variant="body2" textAlign='center' style={{paddingBottom : 3}}>{traitName}</Typography>
        <Box sx={{backgroundColor : theme.palette.primary.main, borderRadius : '50%', width : 50, height : 50, position : 'relative', margin : 'auto'}}>          
          <Typography variant="body2" textAlign={'center'} sx={{paddingTop : 2}}>{traitValue}</Typography>
        </Box>
        
      </Box>    
    </>
  )
}

export default NumericTrait
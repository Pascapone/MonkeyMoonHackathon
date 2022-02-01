import { Box, Typography, Chip, Stack, styled } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';

const StyledChip = styled(Chip)(({ theme }) => ({
  '& .MuiChip-label': {
    fontSize : 22,
  },
  height : 40
}));

const CategoricalTrait = ({ traitName, traitValue, onRemoveTrait }) => { 
  return (
    <>     
      <Box sx={{display: "inline-block", padding : 1, paddingTop : 1}}>
          <Typography variant="body2" textAlign='center' style={{paddingBottom : 3}}>{traitName}</Typography>
          <Stack>
            <StyledChip label={traitValue} variant="outlined" />        
          </Stack>
      </Box>    
    </>
  )
}

export default CategoricalTrait
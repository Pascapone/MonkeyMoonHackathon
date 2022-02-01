

import { Card, CardContent, Typography } from "@mui/material";
import { CardHeader, Box, Chip, chipClasses } from "@mui/material";


import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';


import { useTheme } from "@mui/material";

const NumberCard = ({icon, value, title, subtitle, gain, postfix}) => {

  const theme = useTheme();
  return(
    <Card sx={{margin : 2, borderRadius : 0, height : '100%'}}>          
      <CardHeader 
        title={title}
        titleTypographyProps={{sx : {fontSize : 16}}}
        subheaderTypographyProps={{sx : {fontSize : 12}}}
        subheader={subtitle}
      />    
      <CardContent sx={{marginTop : -1}}>   
        <Box display={'flex'} alignItems={'center'}>
          <Box sx={{minWidth: "75%"}}>
          <Typography variant="h6">
            {value}
          </Typography>  
          
          {gain &&
            <Chip 
              sx={{
                marginTop : 1, 
                [`& .${chipClasses.icon}`]: {
                  color: gain >= 0 ? theme.palette.success.main : theme.palette.error.main
                },
                color : gain >= 0 ? theme.palette.success.main : theme.palette.error.main
              }} 
              icon={gain >= 0 ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>} 
              label={gain >= 0 ? `+${gain}${postfix ? postfix : ''} in 24h` : `${gain}${postfix ? postfix : ''} in 24h`}
            />   
          }
                   
          </Box>      
          <Box justifyContent={'flex-end'} sx={{width : '100%', display : {xs : 'none', sm : 'flex'}}}>            
            {icon}                
          </Box>
        </Box>
        
      </CardContent>                   
    </Card>
  )
}

export default NumberCard
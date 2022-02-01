

import { Card, CardContent, Typography } from "@mui/material";
import { CardHeader, Box } from "@mui/material";


const TextCard = ({icon, text, title, subtitle}) => {

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
                <Typography variant="body1" color="text.secondary">                
                  {text}                 
                </Typography>                      
              </Box>      
              <Box justifyContent={'flex-end'} sx={{width : '100%', display : {xs : 'none', md : 'flex'}}}>
                {icon}
              </Box>
            </Box>
          </CardContent>                   
        </Card>
  )
}

export default TextCard
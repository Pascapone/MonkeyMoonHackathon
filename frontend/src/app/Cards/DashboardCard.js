import { Card, CardContent, Typography, Button, CardActions, IconButton } from "@mui/material";
import { CardHeader, CardMedia, Stack } from "@mui/material";

import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';

const DashboardCard = ({image, text, title, date}) => {
 
  return(
    <Card sx={{marginBottom : 1, borderRadius : 0}}>
      <CardMedia
        component="img"
        height="194"
        image={image}
        alt="Enter the Chain"
      />
      <CardHeader        
        title={title}
        titleTypographyProps={{sx : {fontSize : 16}}}
        subheaderTypographyProps={{sx : {fontSize : 14}}}
        subheader={date}
      />    
      <CardContent sx={{height : 100, marginTop : -1}}> 
        <div style={{height : 80, marginLeft: 0, marginRight : 0}}>               
            <Typography className="four-line-clamp" variant="body1" color="text.secondary">           
              {text}          
            </Typography>               
        </div>           
      </CardContent>
      <CardActions disableSpacing sx={{marginTop : 3}}>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>    
        <Stack style={{width : '100%'}} spacing={1} direction="row" justifyContent="flex-end" >
          <Button size="small">Learn More</Button>
        </Stack>
      </CardActions>          
    </Card>
  )
}

export default DashboardCard
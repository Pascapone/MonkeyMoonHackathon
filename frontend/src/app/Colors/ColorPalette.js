import { Paper } from "@mui/material";
import { useTheme } from "@mui/material";

const ColorPalette = () => {
  const theme = useTheme()
  return(
    <div style={{display : 'flex'}}>
      <div>
        <Paper style={{width: 150, height: 150, backgroundColor : theme.palette.primary.main}}>
          Some Text
        </Paper>
        <Paper style={{width: 150, height: 150, backgroundColor : theme.palette.primary.light}}>
          Some Text
        </Paper>
        <Paper style={{width: 150, height: 150, backgroundColor : theme.palette.primary.dark}}>
          Some Text
        </Paper>
        <Paper style={{width: 150, height: 150, backgroundColor : theme.palette.primary.main}}>
          Some Text
        </Paper>
        <Paper style={{width: 150, height: 150, backgroundColor : theme.palette.primary.light}}>
          Some Text
        </Paper>
        <Paper style={{width: 150, height: 150, backgroundColor : theme.palette.primary.dark}}>
          Some Text
        </Paper>
      </div>
      <div style={{float : 'right'}}>       
        <Paper style={{width: 150, height: 150, backgroundColor : theme.palette.secondary.main}}>
          Some Text
        </Paper>
        <Paper style={{width: 150, height: 150, backgroundColor : theme.palette.secondary.light}}>
          Some Text
        </Paper>
        <Paper style={{width: 150, height: 150, backgroundColor : theme.palette.secondary.dark}}>
          Some Text
        </Paper>
      </div>
    </div>
  )
}

export default ColorPalette;
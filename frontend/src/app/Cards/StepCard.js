import { Card, CardContent, Typography } from "@mui/material";
import { CardHeader, Box, Stepper, Step, StepLabel } from "@mui/material";

const StepCard = ({icon, steps, title, subtitle, activeStep}) => {
  return(
    <Card sx={{margin : 2, borderRadius : 0, height : '100%'}}>          
          <CardHeader 
            title={title}
            titleTypographyProps={{sx : {fontSize : 16}}}
            subheaderTypographyProps={{sx : {fontSize : 12}}}
            subheader={subtitle}
          />    
          <CardContent sx={{height : '100%', marginTop : -1}}>   
            <Box display={'flex'} alignItems={'center'}>
              <Box sx={{minWidth: "75%"}}>
              <Stepper activeStep={activeStep} sx={{display : { xs : 'none', sm : 'flex'}}}>
                {steps.map((step, index) => {
                  const stepProps = {};
                  const labelProps = {};    

                  if (step.subSubtitle) {
                    labelProps.optional = (
                      <Box style={{display : 'flex', flexDirection : 'column'}}>
                        <Typography variant="caption">{step.subtitle}</Typography>
                        <Typography variant="caption">{step.subSubtitle}</Typography>
                      </Box>
                    );
                  }
                  else if(step.subtitle){
                    labelProps.optional = (
                      <Box style={{display : 'flex', flexDirection : 'column'}}>
                        <Typography variant="caption">{step.subtitle}</Typography>
                      </Box>
                    );
                  }
                                
                  return (
                    <Step key={step.label} {...stepProps}>
                      <StepLabel {...labelProps}>{step.label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>  
              <Stepper activeStep={activeStep} orientation='vertical' sx={{display : { xs : 'block', sm : 'none'}}}>
                {steps.map((step, index) => {
                  const stepProps = {};
                  const labelProps = {};    

                  if (step.subSubtitle) {
                    labelProps.optional = (
                      <Box style={{display : 'flex', flexDirection : 'column'}}>
                        <Typography variant="caption">{step.subtitle}</Typography>
                        <Typography variant="caption">{step.subSubtitle}</Typography>
                      </Box>
                    );
                  }
                  else if(step.subtitle){
                    labelProps.optional = (
                      <Box style={{display : 'flex', flexDirection : 'column'}}>
                        <Typography variant="caption">{step.subtitle}</Typography>
                      </Box>
                    );
                  }
                                
                  return (
                    <Step key={step.label} {...stepProps}>
                      <StepLabel {...labelProps}>{step.label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper> 
              </Box>      
              <Box display={'flex'} justifyContent={'flex-end'} sx={{width : '100%'}}>
                
                {icon}
                   
              </Box>
            </Box>
           
          </CardContent>                   
        </Card>
  )
}

export default StepCard
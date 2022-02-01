import { useTheme } from "@mui/material";
import Grid from '@mui/material/Grid';

import floatingMonkeyImage from '../../assets/images/mm_w__float_helmet2.png'

import { Typography, Button, Box, styled, Card, CircularProgress, CardHeader, CardContent, IconButton, Badge, CardActions } from "@mui/material";
import { tabsClasses } from '@mui/material/Tabs';

import SharePopover from "../Shared/SharePopover";
import FavoriteIcon from '@mui/icons-material/Favorite';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { motion } from 'framer-motion' 

import { useSelector } from "react-redux";

import { useMoralis } from "react-moralis";

import { copiedToClipboardEvent } from "../Shared/events";

import { useEffect, useState, useRef } from 'react'

import NftItemCard from "../Cards/NftItemCard";
import {v4 as uuid} from 'uuid'

import { getBatchBalance } from "../web3/web3Nft";
import CreateNFT from "./CreateNFT";

import { useParams } from "react-router-dom";

import CategoricalTrait from "./CategoricalTrait";
import NumericTrait from "./NumericTrait";
import PercentageTrait from "./PercentageTrait";

import axios from 'axios'

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 10,    
    padding: '0 4px',
  },
}));

const ShowTrait = ({ traitName, traitValue, type }) => {
  switch (type) {
    case "trait_type_cat":
      return(
        <CategoricalTrait traitName={traitName} traitValue={traitValue}/>
      )
    case "trait_type_num":
      return <NumericTrait traitName={traitName} traitValue={traitValue}/>
    case "display_type_boost_num":      
      return null 
    case "display_type_boost_percent":      
      return <PercentageTrait traitName={traitName} traitValue={traitValue}/>
    case "display_type_num":     
      return null 
    default:
      return null 
  }    
}


const NFTDetails = () => {
  const contractDeployed = useSelector(state => state.monkeyMoon.contractDeployed)

  const { isAuthenticated, account, web3, Moralis, isInitialized, isWeb3Enabled } = useMoralis();

  const [nft, setNft] = useState()

  const frameRef = useRef()
  const videoRef = useRef()

  const { user } = useMoralis()

  const [imageLoaded, setImageLoaded] = useState(false)
  const [liked, setLiked] = useState(false)
  const [numLikes, setNumLikes] = useState(0)
  const [attributes, setAttributes] = useState([])

  const theme = useTheme()

  let urlParams = useParams();

  console.log(urlParams)

  const monkeyMoonAddress = useSelector(state => state.monkeyMoon.address)  

  const handleTokenAddressClick = () => {
    navigator.clipboard.writeText(monkeyMoonAddress)
    document.dispatchEvent(copiedToClipboardEvent)
  }

  const loadNft = async () => {
    const nftQuery = new Moralis.Query("MonkeyMoonNFT")    
    console.log(urlParams.objectId)
    nftQuery.equalTo("objectId", urlParams.objectId)
    const queriedNft = await nftQuery.first()
    console.log(queriedNft)
    if(queriedNft){
      setNft(queriedNft)
      setNumLikes(queriedNft.get("likes") ? queriedNft.get("likes").length : 0)
      setLiked(queriedNft.get("likes") ? queriedNft.get("likes").includes(user.id) : false)

      console.log(queriedNft.get("jsonGateway"))

      try {
        const json = await axios.get(queriedNft.get("jsonGateway"), {
          method : "GET"
        })

        if(json.data.attributes){
          console.log(json.data.attributes)
          setAttributes(json.data.attributes)
        }
      } catch (error) {
        console.log(error)
      }
      


    }
    else{
      setNft(null)
    }
  }

  const handleLikeClick = async () => {
    if(!liked){
      const confirmed = await Moralis.Cloud.run("likeNft", {objectId : nft.id})
      if(confirmed){
        setLiked(true)
        setNumLikes(prev => prev + 1)
      } 
    }
    else{
      const confirmed = await Moralis.Cloud.run("likeNft", {objectId : nft.id})
      if(confirmed){
        setLiked(false)
        setNumLikes(prev => prev - 1)
      } 
    }
  }

  useEffect(() => {
    if(isInitialized)
      loadNft();  
  }, [isInitialized]);
  

  const floatingMonkeyTransition = {
    type: "spring",
    damping: 10,
    stiffness: 100,
    repeat: Infinity, 
    duration: 4
  } 

  const handleVideoLoaded = () => {
    setImageLoaded(true)
  }


  useEffect(() => {
    if(videoRef.current){
      videoRef.current.addEventListener('loadeddata', handleVideoLoaded, false);     
    }
  
    return () => {
      if( videoRef.current){
        videoRef.current.removeEventListener('loadeddata', handleVideoLoaded, false);
      }
    };
  }, [videoRef.current]);
  

  return(
    <>
      <Box sx={{width : '100%'}}>
        <Grid container spacing={2} rowSpacing={2}>        
          <Grid item xs={12} sm={12} md={12} lg={4} sx={{height : 140}}>
            <motion.div drag dragConstraints={{ left: -20, right: 20, top:-20, bottom: 20 }} className="topLayer" onClick={(e) => e.preventDefault()}>
              <motion.div initial={{y : 0}} transition={floatingMonkeyTransition} animate={{y : [0, -10, 0]}}>
                <img src={floatingMonkeyImage} alt="floating-monkey" onDragStart={(e) => e.preventDefault()} style={{margin : 'auto', display : 'block', marginTop : 20, width : 100}}/>
              </motion.div>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={4} sx={{height : 120}}>
              <Box style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection : 'column'}}>
              <Typography variant="h3" textAlign={'center'} style={{marginBottom : 10, marginTop : 0}}>NFT Details</Typography>
              <Button variant="outlined" color="secondary" size='small' startIcon={<ContentCopyIcon />} onClick={handleTokenAddressClick}>
                Token Address
              </Button> 
            </Box>         
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={4} sx={{height : 0}}>          
          </Grid>  
          <Grid item xs={12} sm={12} md={12} lg={12}>
            {nft ? 
              <Card sx={{marginBottom : 1, borderRadius : 0, height : '100%'}}> 
                <Grid container>
                  <Grid item xs={12} sm={12} md={6} sx={{marginTop : 3, marginBottom : 3}}>
                    <Box style={{height : 300}}>   
                      <div ref={frameRef} style={{width : '100%', position : 'relative', height : '100%'}}>
                        {nft.get("mp4") ?   
                          <div>       
                            <video 
                              style={{
                                position : 'absolute',
                                maxHeight: '100%', 
                                maxWidth: '100%', 
                                top :"50%", 
                                left : '50%', 
                                transform : 'translate(-50%, -50%)', 
                                visibility : 'inherit'
                              }}  
                              controls 
                              autoPlay 
                              loop
                              ref={videoRef}
                            >
                              <source src={nft.get("imageGateway")} style={{maxHeight: "100%", maxWidth: "100%"}} type="video/mp4"/>
                            </video> 
                          </div>              
                        :
                        <>
                          <img 
                            style={{position : 'absolute', maxHeight: '100%', maxWidth: '100%', top :"50%", left :"50%", transform : 'translate(-50%, -50%)', visibility : imageLoaded ? 'inherit' :'hidden'}} 
                            src={nft.get("imageGateway")}
                            onLoad={() => setImageLoaded(true)}
                          />
                          {!imageLoaded ?
                            <div style={{position : 'absolute', top : '50%', left : '50%', transform : 'translate(-50%, -50%)'}}>
                                <CircularProgress />
                              </div>
                            :
                            <></>
                          }
                        </>
                      }   
                      </div>
                    </Box>  
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} sx={{marginTop : 3, marginBottom : 3}}>
                    <Box sx={{marginLeft: 2, marginRight : 2, backgroundColor : theme.palette.grey[900], height : '100%', padding : 1}}>
                        <Typography variant="h4">
                          {nft.get("name")}
                        </Typography>               
                        <Typography className="four-line-clamp" variant="body1" color="text.secondary">           
                          {nft.get("description")}          
                        </Typography>               
                    </Box> 
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <Box sx={{margin : 2}}>
                        <Typography variant="h5">Categorical Traits:</Typography>
                        <Card elevation={10} sx={{marginTop : 1, padding : 1}}>
                          <Grid container justifyContent="space-evenly">
                            {attributes && attributes.reduce((filtered, attribute) => {                       
                              if(attribute.type === "trait_type_cat"){
                                filtered.push(
                                <Grid item>
                                  <ShowTrait key={uuid()} traitName={attribute.trait_type} traitValue={attribute.value} type={attribute.type}/>
                                </Grid>
                                )                  
                              } 
                              return filtered  
                              }, [])
                            }
                          </Grid>
                        </Card>   
                      </Box>
                      <Box sx={{margin : 2}}>
                        <Typography variant="h5">Numerical Traits:</Typography>
                        <Card elevation={10} sx={{marginTop : 1, padding : 1}}>
                          <Grid container justifyContent="space-evenly">
                            {attributes && attributes.reduce((filtered, attribute) => {                       
                              if(attribute.type === "trait_type_num"){
                                filtered.push(
                                <Grid item>
                                  <ShowTrait key={uuid()} traitName={attribute.trait_type} traitValue={attribute.value} type={attribute.type}/>
                                </Grid>
                                )                        
                              }  
                              return filtered 
                              }, [])
                            }
                          </Grid>
                        </Card>   
                      </Box>
                      <Box sx={{margin : 2}}>
                        <Typography variant="h5">Percentage Traits:</Typography>
                        <Card elevation={10} sx={{marginTop : 1, padding : 1}}>
                          <Grid container justifyContent="space-evenly">
                            {attributes && attributes.reduce((filtered, attribute) => {                       
                              if(attribute.type === "display_type_boost_percent"){
                                filtered.push(
                                  <Grid item>
                                    <ShowTrait key={uuid()} traitName={attribute.trait_type} traitValue={attribute.value} type={attribute.type}/>
                                  </Grid>
                                )                        
                              }  
                              return filtered 
                              }, [])
                            }
                          </Grid>                
                        </Card>   
                      </Box>     
                    </Grid>
                  {/* </CardContent> */}
                </Grid>
                <CardActions disableSpacing sx={{}}>
                  <StyledBadge badgeContent={numLikes} max={10000} color="primary">
                    <IconButton onClick={handleLikeClick} aria-label="add to favorites">
                      <FavoriteIcon style={{color : liked ? theme.palette.error.main : theme.palette.grey[100]}}/>
                    </IconButton>
                  </StyledBadge>
                  <SharePopover url={`https://app.monkeymoon.club/nft-details/${nft.id}`}/>
                </CardActions>          
              </Card>
              :
              <Box>
                <Typography color='error' variant='h4' textAlign={'center'}>NFT does not exist</Typography>
              </Box>
            }
          </Grid> 
        </Grid>  
        <Grid item xs={12} sx={{height : 20}}></Grid>
        {/* <Box style={{height : 20, width : '100%'}}></Box> */}
      </Box>
      
    </>
  )
}

export default NFTDetails;
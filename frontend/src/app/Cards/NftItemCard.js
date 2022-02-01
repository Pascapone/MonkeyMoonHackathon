import { Card, CardContent, Typography, Button, CardActions, IconButton, CircularProgress, Badge } from "@mui/material";
import { CardHeader, CardMedia, Stack, styled, Tooltip } from "@mui/material";

import FavoriteIcon from '@mui/icons-material/Favorite';


import { useRef, useEffect, useState } from "react";

import SharePopover from "../Shared/SharePopover";

import { useMoralis } from "react-moralis";

import { useTheme } from "@mui/material";

import { useNavigate } from "react-router-dom";

import StarsIcon from '@mui/icons-material/Stars';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 10,    
    padding: '0 4px',
  },
}));

const NftItemCard = ({nftObject}) => {
  const frameRef = useRef()
  const videoRef = useRef()

  const text = nftObject.get("description")
  const title = nftObject.get("name") 
  const date = nftObject.updatedAt.toUTCString()
  const image = nftObject.get("imageGateway") 
  const id = nftObject.get("tokenId")
  const likes = nftObject.get("likes")
  const mp4 = nftObject.get("mp4")
  const offical = nftObject.get("offical")

  const { user, Moralis } = useMoralis()

  const [imageLoaded, setImageLoaded] = useState(false)
  const [liked, setLiked] = useState(likes ? likes.includes(user.id) : false)
  const [numLikes, setNumLikes] = useState(likes ? likes.length : 0)

  const navigate = useNavigate()

  const theme = useTheme()

  const handleLikeClick = async () => {
    if(!liked){
      const confirmed = await Moralis.Cloud.run("likeNft", {objectId : nftObject.id})
      if(confirmed){
        setLiked(true)
        setNumLikes(prev => prev + 1)
      } 
    }
    else{
      const confirmed = await Moralis.Cloud.run("likeNft", {objectId : nftObject.id})
      if(confirmed){
        setLiked(false)
        setNumLikes(prev => prev - 1)
      } 
    }
  }

  useEffect(() => {
    frameRef.current.style.height = `${frameRef.current.clientWidth}px`
  }, [frameRef]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  
    return () => {
      window.removeEventListener("resize", handleResize)
    };
  }, []);

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
  
  
  const handleResize = () => {
    frameRef.current.style.height = `${frameRef.current.clientWidth}px`
    console.log(frameRef.current.clientWidth)
  }

  const handleNftClicked = () => {
    navigate(`/nft-details/${nftObject.id}`)
  }

  
  
 
  return(

    <Card sx={{marginBottom : 1, borderRadius : 0, height : '100%', position : 'relative'}}>
      
      <div ref={frameRef} style={{width : '100%', position : 'relative', cursor : 'pointer'}} onClick={handleNftClicked}>
        {mp4 ? 
      
          <video 
            style={{
              maxHeight: "100%", 
              maxWidth: "100%", 
              marginLeft :"50%", 
              marginTop : '50%', 
              transform : 'translate(-50%, -50%)', 
              visibility : imageLoaded ? 'inherit' :'hidden'
            }}  
            autoPlay 
            loop
            ref={videoRef}
          >
            <source src={image} style={{maxHeight: "100%", maxWidth: "100%"}} type="video/mp4"/>
          </video>
     
        :
        <>
          <img 
            style={{maxHeight: "100%", maxWidth: "100%", marginLeft :"50%", marginTop : '50%', transform : 'translate(-50%, -50%)', visibility : imageLoaded ? 'inherit' :'hidden'}} 
            src={image}
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
      <CardHeader        
        title={title}
        titleTypographyProps={{sx : {fontSize : 16}}}
        subheaderTypographyProps={{sx : {fontSize : 14}}}
        subheader={"User NFT"}
        sx={{marginTop : 2}}
      />    
      <CardContent sx={{marginTop : -1, marginBottom : 7}}> 
        <div style={{marginLeft: 0, marginRight : 0}}>               
            <Typography className="four-line-clamp" variant="body1" color="text.secondary">           
              {text}          
            </Typography>               
        </div>           
      </CardContent>
      <CardActions disableSpacing sx={{position : 'absolute', bottom : 0, marginTop : 15}}>
        <StyledBadge badgeContent={numLikes} max={10000} color="primary">
          <IconButton onClick={handleLikeClick} aria-label="add to favorites">
            <FavoriteIcon style={{color : liked ? theme.palette.error.main : theme.palette.grey[100]}}/>
          </IconButton>
        </StyledBadge>
        <SharePopover url={`https://app.monkeymoon.club/nft-details/${nftObject.id}`}/>
        {offical &&
          <Tooltip placement="top" title="Offical Monkey Moon NFT">
            <StarsIcon/>
          </Tooltip>
        }
        
      </CardActions>          
    </Card>

  )
}

export default NftItemCard
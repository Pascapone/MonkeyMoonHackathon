import {
  FacebookShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

import {
  FacebookIcon,
  RedditIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

import { useRef, useState } from "react";

import { Popover, IconButton } from "@mui/material";

import ShareIcon from '@mui/icons-material/Share';
import { style } from "@mui/system";

const SharePopover = ({ url }) => {

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    console.log("Click")
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'share' : undefined;

  return(
    <div>
      <IconButton aria-describedby={id} onClick={handleClick}>
        <ShareIcon />
      </IconButton>  
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        PaperProps={{style : {
        },
      }}
      >
        <div style={{marginTop : 5, marginRight : 5, marginLeft : 5}}>
          <WhatsappShareButton url={url} style={{margin : 3}}>
            <WhatsappIcon size={32} round={true}/>
          </WhatsappShareButton>
          <TwitterShareButton url={url} style={{margin : 3}}>
            <TwitterIcon size={32} round={true}/>
          </TwitterShareButton>
          <TelegramShareButton url={url} style={{margin : 3}}>
            <TelegramIcon size={32} round={true}/>
          </TelegramShareButton>
          <RedditShareButton url={url} style={{margin : 3}}>
            <RedditIcon size={32} round={true}/>
          </RedditShareButton>
          <FacebookShareButton url={url} style={{margin : 3}}>
            <FacebookIcon size={32} round={true}/>
          </FacebookShareButton>
        </div>
      </Popover>
      
    </div>
  )
}

export default SharePopover
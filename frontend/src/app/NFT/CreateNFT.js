import { useEffect, useRef, useState } from 'react'
import { useMoralis } from "react-moralis"
import { Grid, Box, Card, Typography, Button, TextField, FormControl, Input, InputLabel, MenuItem, Select, Stack, styled } from '@mui/material'
import { v4 as uuid } from 'uuid'
import { getNumTokens, mintNft } from '../web3/web3Nft'
import CategoricalTrait from './CategoricalTrait'
import NumericTrait from './NumericTrait'
import PercentageTrait from './PercentageTrait'
import React, {useCallback} from 'react'
import { useDropzone } from 'react-dropzone'
import { useTheme } from '@mui/material'
import ImageIcon from '@mui/icons-material/Image';

import { getNumTokensOffical, mintNftOffical, userIsOwner } from '../web3/web3NftOffical'

import LoadingButton from '@mui/lab/LoadingButton';

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

const StyledDiv = styled('div')(({theme}) => ({  
  border : '1px solid',
  borderColor : theme.palette.grey[700],
  borderRadius : 5,
  display : 'inline-block', 
  cursor : 'pointer',
  width : 220,
  padding : 10,
  "&:hover" : {
    borderColor : theme.palette.grey[300], 
  }
}))


const CreateNFT = () => {
  const { user, isAuthenticated, account, Moralis, web3 } = useMoralis()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileURL, setFileURL] = useState()
  const [selectedAttributeType, setSelectedAttributeType] = useState("trait_type_cat")
  const [traitName, setTraitName] = useState("")
  const [traitValue, setTraitValue] = useState("")
  const [attributes, setAttributes] = useState([])
  const [amount, setAmount] = useState(1)  

  const [submissionLoading, setSubmissionLoading] = useState(false)
 
  const [mp4, setMp4] = useState(false)

  const dropzoneRef = useRef()

  const theme = useTheme()

  const onDrop = useCallback(acceptedFiles => {
    const data = acceptedFiles[0]
    setSelectedFile(data);

    setMp4(data.type === 'video/mp4' ? true : false)

    console.log(data)

    const url = URL.createObjectURL(data)
    setFileURL(url)
  }, [])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop}) 

  const handleChangeName = (e) => {
    setName(e.target.value)
  }

  const handleChangeDescription = (e) => {
    setDescription(e.target.value)
  }

  const handleFileChange = async (e) => {		
    const data = e.target.files[0]
    setSelectedFile(data);    
  }

  const handleSubmission = async () => {
    if(!selectedFile) return console.log("No Image")
    if(!name) return console.log("No Name")
    if(!description) return console.log("No Description")
    if(!amount || amount <0 ) return console.log("Not a valid amount") 

    setSubmissionLoading(true)

    const isOwner = await checkOwner()
    console.log("Owner", isOwner)
    const file = new Moralis.File(selectedFile.name, selectedFile)
    await file.saveIPFS()
    const url = file.ipfs()
    const hash = file.hash()

    let tokenId
    if(isOwner){
      tokenId = await getNumTokensOffical()
    }
    else{
      tokenId = await getNumTokens()
    }
     
    const json = {
      id : tokenId,
      name : name,
      image : `https://ipfs.io/ipfs/${hash}`,
      attributes : attributes
    }

    const jsonFile = new Moralis.File(`${name}.json`, {base64 : btoa(JSON.stringify(json, null, 2))})
    await jsonFile.saveIPFS()
    const jsonUrl = jsonFile.ipfs()
    const jsonHash = jsonFile.hash()

    const ipfsMetadataUri = `https://ipfs.io/ipfs/${jsonHash}`
    
    const NFT = Moralis.Object.extend("MonkeyMoonNFT")
    const nft = new NFT()
    nft.set("name", name)
    nft.set("imageIpfs", `https://ipfs.io/ipfs/${hash}`)
    nft.set("jsonIpfs", `https://ipfs.io/ipfs/${jsonHash}`)
    nft.set("imageGateway", url)
    nft.set("jsonGateway", jsonUrl)
    nft.set("tokenId", tokenId)
    nft.set("amount", amount)
    nft.set("description", description)
    nft.set("likes", [])
    nft.set("mp4", mp4)
    nft.set("creator", user)
    nft.set("offical", isOwner)

    console.log("Create")
    if(isOwner){
      await mintNftOffical(web3, ipfsMetadataUri, amount, onConfirmation, onError, nft)
    }
    else{
      await mintNft(web3, ipfsMetadataUri, amount, onConfirmation, onError, nft)
    }
    
   
	};

  const onConfirmation = (nft) => {
    setSubmissionLoading(false)
    const createdEvent = new Event("nftMinted")
    document.dispatchEvent(createdEvent)
    nft.save()
  }

  const onError = () => {
    setSubmissionLoading(false)
  }

  const handleChangeType = (e) => {
    setSelectedAttributeType(e.target.value)
  } 

  const handleChangeTraitName = (e) => {
    setTraitName(e.target.value)
  }

  const handleChangeValue = (e) => {
    setTraitValue(e.target.value)
  }

  const handleAddAttribute = () => {
    switch (selectedAttributeType) {
      case "trait_type_cat":
        setAttributes(prev => [...prev, {
          trait_type: traitName, 
          value: traitValue,
          type: selectedAttributeType
        }])
        break;
      case "trait_type_num":
        setAttributes(prev => [...prev, {
          trait_type: traitName, 
          value:  Number(traitValue),
          type: selectedAttributeType
        }])
        break;    
      case "display_type_boost_num":
        setAttributes(prev => [...prev, {
          display_type: "boost_number",
          trait_type: traitName, 
          value:  Number(traitValue),
          type: selectedAttributeType
        }])
        break;
      case "display_type_boost_percent":
        setAttributes(prev => [...prev, {
          display_type: "boost_percentage",
          trait_type: traitName, 
          value: Number(traitValue),
          type: selectedAttributeType
        }])
        break;
      case "display_type_num":
        setAttributes(prev => [...prev, {
          display_type: "number",
          trait_type: traitName, 
          value:  Number(traitValue),
          type: selectedAttributeType
        }])
        break;
      default:
        break;
    }    
  }

  const handleChangeAmount = (e) => {
    setAmount(e.target.value)
  }

  useEffect(() => {
    if(isDragActive){
      dropzoneRef.current.style.borderColor = theme.palette.grey[300]      
    }
    else{
      dropzoneRef.current.style.borderColor = theme.palette.grey[700]      
    }
  }, [isDragActive])

  const checkOwner = async () => {
    const isOwner = await userIsOwner(web3)
    return isOwner 
  }  

  return(
    <>
      {isAuthenticated ?      
        <Box sx={{ width: '100%', margin : 3 }}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12}>
              <Card>
                <Typography textAlign={'center'} variant='h4' sx={{marginTop : 2}}>Create NFT</Typography>
                <Box sx={{margin : 2}}>
                  <TextField
                    id="nft-name"
                    label="NFT Name"
                    style={{maxWidth : 400}}
                    onChange={handleChangeName}
                  />
                </Box>
                <Box sx={{margin : 2}}>
                  <TextField
                    id="nft-description"
                    label="NFT Description"
                    style={{width : '100%'}}
                    multiline
                    onChange={handleChangeDescription}
                  />                  
                </Box>
                <Box sx={{margin : 2}}>  
                  <StyledDiv {...getRootProps()} ref={dropzoneRef}>
                    <input {...getInputProps()} accept="image/*,video/mp4" multiple={false}/>
                   
                      {fileURL ? 
                    
                        (mp4 ?                           
                          <div>
                            <video style={{maxWidth : 200}} controls autoPlay loop>
                              <source src={fileURL} type="video/mp4"/>
                            </video>
                          </div>                      
                          :
                          <img style={{maxWidth : 200, backgroundColor : 'blue', pointerEvents : 'none'}} src={fileURL} alt='NO Image'/>
                        )                        
                        :
                        <Box style={{textAlign : 'center', pointerEvents : 'none'}}>
                          <ImageIcon style={{fontSize : 52}} />    
                        </Box>              
                      }
                      {
                        isDragActive ?
                          <p style={{textAlign : 'center', pointerEvents : 'none'}}>Drop the files here ...</p> :
                          <p style={{textAlign : 'center', pointerEvents : 'none'}}>Drag 'n' drop or select file</p>                          
                      }   
                                
                  </StyledDiv>
                </Box>
                
                <Stack direction={{xs : 'column', sm : 'column', md :'row'}}>
                  <Box sx={{margin : 2}}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Attribute</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedAttributeType}
                        label="Attribute Type"
                        onChange={handleChangeType}
                      >
                        <MenuItem value={"trait_type_cat"}>Trait Type Category</MenuItem>
                        <MenuItem value={"trait_type_num"}>Trait Type Number</MenuItem>
                        <MenuItem value={"display_type_boost_percent"}>Boost Percent</MenuItem>
                      </Select>                    
                    </FormControl>  
                  </Box>
                  <Box sx={{margin : 2, minWidth : 150}}>                   
                    <TextField
                      label="Trait Name"
                      onChange={handleChangeTraitName}
                      type='text'
                    />                                        
                  </Box>
                  {selectedAttributeType === "trait_type_cat" ?
                    <Box sx={{margin : 2, minWidth : 150}}>                   
                      <TextField
                        label="Value"
                        onChange={handleChangeValue}
                        type='text'
                      />                                        
                    </Box>
                    :
                    <Box sx={{margin : 2, minWidth : 150}}>                   
                      <TextField
                        label="Value"
                        onChange={handleChangeValue}
                        type='number'
                      />                                        
                    </Box>
                  }
                  <Box sx={{margin : 2}}>
                    <Button onClick={handleAddAttribute} variant='contained' sx={{height : '100%'}}>Add</Button>
                  </Box>
                  
                </Stack>                
                <Box sx={{margin : 2}}>
                  <Typography variant="h5">Categorical Traits:</Typography>
                  <Card elevation={10} sx={{marginTop : 1, padding : 1}}>
                    <Grid container justifyContent="space-evenly">
                      {attributes.reduce((filtered, attribute) => {                       
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
                      {attributes.reduce((filtered, attribute) => {                       
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
                      {attributes.reduce((filtered, attribute) => {                       
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
                <Box sx={{margin : 2, width : 200}}>                   
                  <TextField
                    label="Amount"
                    style={{width : 200}}
                    onChange={handleChangeAmount}
                    type='number'
                  />                                        
                </Box>
                <Box sx={{margin : 2}}>
                  <LoadingButton loading={submissionLoading} 
                    onClick={handleSubmission} 
                    variant='contained' 
                    size="small" 
                  >
                    Create NFT
                  </LoadingButton>
                  {/* <Button onClick={handleSubmission} variant="contained" component="span">
                    Create NFT
                  </Button> */}
                </Box>              
              </Card>
            </Grid>            
          </Grid>
        </Box>
        :
        <div>No Access</div>
      }      
    </>    
  )
}

export default CreateNFT
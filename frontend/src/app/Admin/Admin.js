import { useState } from 'react'
import { useMoralis } from "react-moralis"
import { Grid, Box, Card, Typography, Button, TextField, FormControl, Input, InputLabel, MenuItem, Select, Stack } from '@mui/material'
import { v4 as uuid } from 'uuid'
import { getNumTokens, mintNft } from '../web3/web3Nft'

const Admin = () => {
  const { user, isAuthenticated, account, Moralis, web3 } = useMoralis()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedAttributeType, setSelectedAttributeType] = useState("trait_type_cat")
  const [traitName, setTraitName] = useState("")
  const [traitValue, setTraitValue] = useState("")
  const [attributes, setAttributes] = useState([])
  const [amount, setAmount] = useState(1)

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

    const file = new Moralis.File(selectedFile.name, selectedFile)
    await file.saveIPFS()
    const url = file.ipfs()
    const hash = file.hash()

    const tokenId = await getNumTokens()
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
    await mintNft(web3, ipfsMetadataUri, amount)

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

    nft.save()

    console.log(jsonFile.ipfs())
	};

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
          value: traitValue
        }])
        break;
      case "trait_type_num":
        setAttributes(prev => [...prev, {
          trait_type: traitName, 
          value:  Number(traitValue)
        }])
        break;    
      case "display_type_boost_num":
        setAttributes(prev => [...prev, {
          display_type: "boost_number",
          trait_type: traitName, 
          value:  Number(traitValue)
        }])
        break;
      case "display_type_boost_percent":
        setAttributes(prev => [...prev, {
          display_type: "boost_percentage",
          trait_type: traitName, 
          value: Number(traitValue)
        }])
        break;
      case "display_type_num":
        setAttributes(prev => [...prev, {
          display_type: "number",
          trait_type: traitName, 
          value:  Number(traitValue)
        }])
        break;
      default:
        break;
    }    
  }

  const handleChangeAmount = (e) => {
    setAmount(e.target.value)
  }

  return(
    <>
      {isAuthenticated ?      
        <Box sx={{ width: '100%', margin : 3 }}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12}>
              <Card>
                <Typography textAlign={'center'} variant='h4'>Create NFT</Typography>
                <Box sx={{margin : 2}}>
                  <TextField
                    id="nft-name"
                    label="NFT Name"
                    style={{width : 400}}
                    onChange={handleChangeName}
                  />
                </Box>
                <Box sx={{margin : 2}}>
                  <TextField
                    id="nft-description"
                    label="NFT Description"
                    style={{width : 800}}
                    multiline
                    onChange={handleChangeDescription}
                  />                  
                </Box>
                <Box sx={{margin : 2}}>
                  <Input accept="image/*" id="contained-button-file" type="file" onChange={handleFileChange}/>
                </Box>
                <Stack direction={'row'}>
                  <Box sx={{margin : 2, width : 200}}>
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
                        <MenuItem value={"display_type_boost_num"}>Boost Number</MenuItem>
                        <MenuItem value={"display_type_boost_percent"}>Boost Percent</MenuItem>
                        <MenuItem value={"display_type_num"}>Plain Number</MenuItem>
                      </Select>                    
                    </FormControl>  
                  </Box>
                  <Box sx={{margin : 2, width : 200}}>                   
                    <TextField
                      label="Trait Name"
                      style={{width : 200}}
                      onChange={handleChangeTraitName}
                      type='text'
                    />                                        
                  </Box>
                  {selectedAttributeType === "trait_type_cat" ?
                    <Box sx={{margin : 2, width : 200}}>                   
                      <TextField
                        label="Value"
                        style={{width : 200}}
                        onChange={handleChangeValue}
                        type='text'
                      />                                        
                    </Box>
                    :
                    <Box sx={{margin : 2, width : 200}}>                   
                      <TextField
                        label="Value"
                        style={{width : 200}}
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
                  {attributes.map((attribute) => (     
                    <Card elevation={10} sx={{marginTop : 2, padding : 1}} key={uuid()}>  
                      {attribute.display_type && <Typography>Display Type: {attribute.display_type}</Typography>}         
                      <Typography>Trait Name: {attribute.trait_type}</Typography>
                      <Typography>Trait Value: {attribute.value}</Typography>                      
                    </Card>   
                  ))}
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
                  <Button onClick={handleSubmission} variant="contained" component="span">
                    Create NFT
                  </Button>
                </Box>              
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <Typography textAlign={'center'}>1</Typography>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <Typography textAlign={'center'}>1</Typography>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <Typography textAlign={'center'}>1</Typography>
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

export default Admin
import MonkeyMoonNftOffcial from '../../abis/MonkeyMoonNFTOffical.json'
import { store } from '../state/store';
import { ethers } from 'ethers'

let monkeyMoonNftOffical

export const getMonkeyMoonNftOffical = () => {
  return monkeyMoonNftOffical;
}

export const loadMonkeyMoonNftOffical = async (provider) => {  
  
  const network = await provider.detectNetwork()

  console.log(network.chainId)

  const networkId = process.env.REACT_APP_NETWORK_ID
  if(network.chainId !== Number(networkId)) return false
       
  const networkData = MonkeyMoonNftOffcial.networks[networkId] 

  if (networkData) {    
    monkeyMoonNftOffical = new ethers.Contract(networkData.address, MonkeyMoonNftOffcial.abi, provider)

    return true
  }
}

export const getNumTokensOffical = async () => {
  const num = await monkeyMoonNftOffical.numTokens()
  return parseInt(num)
}

export const mintNftOffical = async (provider, ipfsMetadataUri, amount, onConfirmation, onError, nft) => {
  const signer = provider.getSigner()

  const connectedContract = monkeyMoonNftOffical.connect(signer)
  
  try {
    const receipt = await connectedContract.mint(ipfsMetadataUri, amount)

    provider.once(receipt.hash, (transaction) => {
      console.log("Confirmed")
      if(onConfirmation) onConfirmation(nft)
    })      

    provider.once('error', (transaction) => {
      console.log("Failed")
      if(onError) onError()
    }) 

    return true

  } catch (error) {
    return false
  }
}

export const getBatchBalanceOffical = async (provider) => {
  const signer = provider.getSigner()

  const address = await signer?.getAddress()

  const numTokens = await getNumTokensOffical()

  const addressArray = []
  const tokenIds = []
  
  for (let index = 0; index < numTokens; index++) {
    addressArray.push(address)    
    tokenIds.push(index)
  }

  const balances = await monkeyMoonNftOffical.balanceOfBatch(addressArray, tokenIds)

  return balances.map((balance) => ( parseInt(balance) ))
}

export const userIsOwner = async (provider) => {
  const signer = provider.getSigner()

  const address = await signer?.getAddress()

  const owner = await monkeyMoonNftOffical.owner()

  return address === owner
}
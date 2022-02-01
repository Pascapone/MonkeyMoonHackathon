import MonkeyMoonNft from '../../abis/MonkeyMoonNFT.json'
import { store } from '../state/store';
import { ethers } from 'ethers'

let monkeyMoonNft

export const getMonkeyMoonNft = () => {
  return monkeyMoonNft;
}

export const loadMonkeyMoonNft = async (provider) => {  
  
  const network = await provider.detectNetwork()

  console.log(network.chainId)

  const networkId = process.env.REACT_APP_NETWORK_ID
  if(network.chainId !== Number(networkId)) return false
       
  const networkData = MonkeyMoonNft.networks[networkId] 

  if (networkData) {    
    monkeyMoonNft = new ethers.Contract(networkData.address, MonkeyMoonNft.abi, provider)

    return true
  }
}

export const getNumTokens = async () => {
  const num = await monkeyMoonNft.numTokens()
  return parseInt(num)
}

export const mintNft = async (provider, ipfsMetadataUri, amount, onConfirmation, onError, nft) => {
  const signer = provider.getSigner()

  const connectedContract = monkeyMoonNft.connect(signer)
  
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

export const getBatchBalance = async (provider) => {
  const signer = provider.getSigner()

  const address = await signer?.getAddress()

  const numTokens = await getNumTokens()

  const addressArray = []
  const tokenIds = []
  
  for (let index = 0; index < numTokens; index++) {
    addressArray.push(address)    
    tokenIds.push(index)
  }

  const balances = await monkeyMoonNft.balanceOfBatch(addressArray, tokenIds)

  return balances.map((balance) => ( parseInt(balance) ))
}
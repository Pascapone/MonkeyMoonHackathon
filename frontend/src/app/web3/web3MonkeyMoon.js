import MonkeyMoon from '../../abis/MonkeyMoonToken.json'
import { store } from '../state/store';
import { setMonkeyMoonAddress } from '../state/slices/monkeyMoonSlice';
import { ethers } from 'ethers'
let web3Speedy
let monkeyMoon

export const getMonkeyMoon = () => {
  return monkeyMoon;
}

export const loadMonkeyMoon = async (provider, onScoreClaimed) => {  
  
  const network = await provider.detectNetwork()

  console.log(network.chainId)

  const networkId = process.env.REACT_APP_NETWORK_ID
  console.log(networkId)
  if(network.chainId !== Number(networkId)) return false  
  
  const networkData = MonkeyMoon.networks[networkId] 
  if (networkData) {    
    monkeyMoon = new ethers.Contract(networkData.address, MonkeyMoon.abi, provider)

    provider.once("block", () => {
      monkeyMoon.on('MonkeyScoreClaimed', function (input, other) {console.log("Event Trigger", input, other)})
    });
    store.dispatch(setMonkeyMoonAddress(monkeyMoon.address))
    return true
  }
}

const tokenImage = 'https://pascapone.github.io/favicon.png';

export const addMonkeyMoonToWallet = async (onAdded, onError, onCanceled) => {

  const tokenAddress = monkeyMoon.address
  const tokenSymbol = await monkeyMoon.symbol()
  const tokenDecimals = await monkeyMoon.decimals()
  try {    
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const message = {
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: tokenAddress, // The address that the token is at.
          symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: tokenDecimals, // The number of decimals in the token
          image: tokenImage, // A string url of the token logo
        },
      },
    }
    const wasAdded = await window.ethereum.request(JSON.parse(JSON.stringify(message)));
  
    if (wasAdded) {
      if(onAdded) onAdded()
    } else {
      if(onCanceled) onCanceled()
    }
  } catch (error) {
    if(onError) onError(error)
  }
}

export const claimMonkeyScore = async (provider, onSend, onError, onConfirmation) => {
  const signer = provider?.getSigner()
  const address = await signer?.getAddress()

  if(!signer || !address) return

  const connectedContract = monkeyMoon.connect(signer)

  let oracleCost = await connectedContract.getClaimCost()

  oracleCost = parseInt(oracleCost) * 1.03

  console.log(oracleCost)

  connectedContract.claimMonkeyScore({ value : ethers.utils.parseEther(oracleCost.toString()) })   
    .then((receipt) => {
      if(onSend) onSend(receipt)
      console.log("Send")

      provider.once(receipt.hash, (transaction) => {
        console.log("Confirmed")
        if(onConfirmation) onConfirmation()
      })      

      provider.once('error', (transaction) => {
        console.log("Failed")
        if(onError) onError()
      })  
    }).catch((error) => {
      console.log(error)
      console.log("User canceled")
      if(onError) onError()
    })
}

export const getMonkeyScore = async (provider) => {
  const signer = provider?.getSigner()
  const address = await signer?.getAddress()

  if(!signer || !address) return

  const score =  await monkeyMoon.monkeyScoreOf(address)
  return score
}
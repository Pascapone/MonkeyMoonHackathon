import ICO from '../../abis/ICO.json'

import {ethers} from 'ethers'

import { store } from "../state/store";
import { setTotalTokensInVault, setTokensInVault, setMaxBuyAmount, setMinBuyAmount, setInvestors, setRates, setTimestamps, setCurrentRate, setTokensLeft, setMaxIcoAmount, setWeiRaisedOfUser, setTotalWeiRaised, setIcoClosed } from "../state/slices/icoSlice";

let monkeyMoonIco

export const loadIco = (provider) => {  
 
  const networkId = process.env.REACT_APP_NETWORK_ID  
  const networkData = ICO.networks[networkId] 
  if (networkData) {    
    monkeyMoonIco = new ethers.Contract(networkData.address, ICO.abi, provider)
  }
  
}

export const loadIcoData = async (provider) => {
  if(!monkeyMoonIco) return

  const signer = provider?.getSigner()

  let address
  try{
    address = await signer?.getAddress() 

  }catch(error){
    address = null
    console.log("Account not connected")
  }

  const totalTokensInVault = await getTotalTokensInVault()
  store.dispatch(setTotalTokensInVault(totalTokensInVault))

  const tokensInVault = address ? await getTokensInVault(address, provider) : 0 
  store.dispatch(setTokensInVault(tokensInVault))

  const maxIcoAmount = await getMaxIcoAmount()
  store.dispatch(setMaxIcoAmount(maxIcoAmount))

  const tokensLeft = maxIcoAmount - totalTokensInVault
  store.dispatch(setTokensLeft(tokensLeft))

  const minBuyAmount = await getMinBuyAmount()
  store.dispatch(setMinBuyAmount(minBuyAmount))

  const maxBuyAmount = await getMaxBuyAmount()
  store.dispatch(setMaxBuyAmount(maxBuyAmount))

  const investors = await getInvestors()
  store.dispatch(setInvestors(investors))

  const rates = await getIcoRates()
  store.dispatch(setRates(rates))

  const timestamps = await getIcoTimestamps()
  store.dispatch(setTimestamps(timestamps))

  const currentRate = await getCurrentRate()
  store.dispatch(setCurrentRate(currentRate))

  const weiRaisedOfUser = address ? await getWeiRaisedOf(address, provider) : 0
  store.dispatch(setWeiRaisedOfUser(weiRaisedOfUser))

  const totalWeiRaised = await getTotalWeiRaised()
  store.dispatch(setTotalWeiRaised(totalWeiRaised)) 

  const closed = await getIcoClosed()
  store.dispatch(setIcoClosed(closed))  
} 

export const buyTokens = async (amount, onSend, onConfirmation, onError, provider) => { 
  if(!monkeyMoonIco) return

  const signer = provider?.getSigner()
  const address = await signer?.getAddress()

  if(!signer || !address) return

  const connectedContract = monkeyMoonIco.connect(signer)

  connectedContract.buyTokens(address, { value : ethers.utils.parseEther(amount.toString()) }) 
    .then((receipt) => {
      if(onSend) onSend(receipt)
      console.log("Send")

      provider.once(receipt.hash, (transaction) => {
        if(transaction.status === 1){
          console.log("Confirmed")
          if(onConfirmation) onConfirmation()
        }
        else{
          console.log("Failed")
        if(onError) onError()
        }
      })      
    }).catch((error) => {
      console.log("User canceled")
      if(onError) onError()
    })
}

export const claimTokens = async (onSend, onConfirmation, onError, provider) => { 
  if(!monkeyMoonIco) return

  const signer = provider?.getSigner()
  const address = await signer?.getAddress()

  if(!signer || !address) return

  const connectedContract = monkeyMoonIco.connect(signer)

  connectedContract.withdrawTokens(address)   
    .then((receipt) => {
      if(onSend) onSend(receipt)
      console.log("Send")

      provider.once(receipt.hash, (transaction) => {
        if(transaction.status === 1){
          console.log("Confirmed")
          if(onConfirmation) onConfirmation()
        }
        else{
          console.log("Failed")
          if(onError) onError()
        }
        
      })    
    }).catch((error) => {
      console.log("User canceled")
      console.log(error)
      if(onError) onError()
    })
}

const getIcoClosed = async () => {
  if(!monkeyMoonIco) return

  const closed = await monkeyMoonIco.hasClosed()

  return closed
} 

const getTotalTokensInVault = async () => {
  if(!monkeyMoonIco) return  

  const mmc = await monkeyMoonIco.totalTokensInVault()

  return parseInt(mmc) / (10**18)
}  

const getTokensInVault = async (address, provider) => {
  if(!monkeyMoonIco) return 

  if(!address) return 0

  const signer = provider.getSigner()

  const connectedContract = monkeyMoonIco.connect(signer)

  const balanceInVault = await connectedContract.balanceOf(address)
  return parseInt(balanceInVault) / (10**18)
} 

const getIcoRates = async () => {  
  if(!monkeyMoonIco) return
  
  const array = await monkeyMoonIco.getRates() 
  
  const ratesArray = []
  for(var i=0; i<array.length; i++){
    ratesArray.push(parseInt(array[i]))      
  }  
  
  return ratesArray
}  

const getIcoTimestamps = async () => {
  if(!monkeyMoonIco) return

  const array = await monkeyMoonIco.getTimestamps()
  const stepsArray = []
  for(var i=0; i<array.length; i++){
    stepsArray.push(parseInt(array[i]*1000))      
  }   
  return stepsArray    
}

const getMinBuyAmount = async () => { 
  if(!monkeyMoonIco) return

  const amount = await monkeyMoonIco.getMinBuyAmount()
  return parseInt(amount) / (10**18)
}

const getMaxBuyAmount = async () => { 
  if(!monkeyMoonIco) return

  const amount = await monkeyMoonIco.getMaxBuyAmount()
  return parseInt(amount) / (10**18)
}

const getMaxIcoAmount = async () => { 
  if(!monkeyMoonIco) return

  const amount = await monkeyMoonIco.getMaxIcoAmount()
  return parseInt(amount) / (10**18)
}

const getCurrentRate = async () => { 
  if(!monkeyMoonIco) return

  const rate = await monkeyMoonIco.getCurrentRate()
  return parseInt(rate)
} 

const getInvestors = async () => { 
  if(!monkeyMoonIco) return

  const investors = await monkeyMoonIco.getInvestors()
  return parseInt(investors)
}

const getWeiRaisedOf = async (address, provider) => {
  if(!monkeyMoonIco) return

  if(!address) return 0

  const signer = provider.getSigner()

  const connectedContract = monkeyMoonIco.connect(signer)

  const amount = await connectedContract.weiRaisedOf(address)
  return parseInt(amount) / (10**18)
}

const getTotalWeiRaised = async () => {
  if(!monkeyMoonIco) return

  const amount = await monkeyMoonIco.weiRaised()
  return parseInt(amount) / (10**18)
}

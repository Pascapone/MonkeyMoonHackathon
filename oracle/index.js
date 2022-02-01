import { ethers } from "ethers";
import MonkeyMoon from './abis/MonkeyMoonToken.json'
import HDWalletProvider from "@truffle/hdwallet-provider"

import Moralis from 'moralis/node.js'

import dotenv from 'dotenv'

dotenv.config()

Moralis.start({ serverUrl : process.env.MORALIS_SERVER_URL, appId : process.env.MORALIS_APPLICATION_ID, masterKey : process.env.MORALIS_MASTER_KEY })

const privateKey = process.env.WALLET_PRIVATE_KEY

let provider = new HDWalletProvider(privateKey, process.env.CHAIN_RPC);

console.log(provider.getAddress())

const web3Provider = new ethers.providers.Web3Provider(provider)

const signer = web3Provider.getSigner()


const onMonkeyScoreClaimed = async (beneficiary) => {
  console.log(beneficiary)
  beneficiary = beneficiary.toLowerCase()

  let score = 0
  try {
    const monkeyMoonWithSigner = monkeyMoon.connect(signer)

    score = await Moralis.Cloud.run("getClaimScore", {ethAddress : beneficiary})

    if(score <= 0) return

    // Set score 0 before starting the oracle action to prevent multiple calls
    const response = await Moralis.Cloud.run("removeClaimScore", {ethAddress : beneficiary, oracleApiKey : process.env.ORACLE_MORALIS_API_KEY})

    const timer = setInterval(() => {
      monkeyMoonWithSigner.writeScore(score, beneficiary)
        .then((receipt) => {
          console.log(receipt)

          web3Provider.once(receipt.hash, async (transaction) => {  
            if(transaction.status === 1 || score === 0) return
            const response = await Moralis.Cloud.run("restoreClaimScore", {ethAddress : beneficiary, oracleApiKey : process.env.ORACLE_MORALIS_API_KEY, score : score})
          })
        })
        .catch(async (error) => {
          console.log(error)
          if(score === 0) return
          
          const response = await Moralis.Cloud.run("restoreClaimScore", {ethAddress : beneficiary, oracleApiKey : process.env.ORACLE_MORALIS_API_KEY, score : score})
        })
      clearInterval(timer)
  }, 4000)
  } catch (error) {   
    console.log(error)
    if(score === 0) return
    
    const response = await Moralis.Cloud.run("restoreClaimScore", {ethAddress : beneficiary, oracleApiKey : process.env.ORACLE_MORALIS_API_KEY, score : score})          
  }
     
}

const networkId = process.env.NETWORK_ID
const networkData = MonkeyMoon.networks[networkId] 
const monkeyMoon = new ethers.Contract(networkData.address, MonkeyMoon.abi, web3Provider)

web3Provider.once("block", () => {
  monkeyMoon.on('MonkeyScoreClaimed', onMonkeyScoreClaimed)
});

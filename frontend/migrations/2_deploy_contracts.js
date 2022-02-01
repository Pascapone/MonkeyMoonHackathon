const { default: Web3 } = require("web3");


// TODO
// -SafeERC20 angucken und für alle implementieren
// -Beneficary for buyTokens and withdrawTokens. Should probably be msgSender

// Deploy with --compile-none for not timing out
// $truffle deploy --network testnet --reset --compile-none

const MonkeyMoonToken = artifacts.require("MonkeyMoonToken");
const ICO = artifacts.require("ICO");
const Taxes = artifacts.require("Taxes");
const NFT = artifacts.require("MonkeyMoonNFT");
const NFTOffical = artifacts.require("MonkeyMoonNFTOffical");

const deployMonkeyMoon = true
const deployICO = true
const deployTaxes = true 
const deployNFT = true
const deployNFTOffical = true


module.exports = async function (deployer) {

  const timespan = 240*1
  const startSpan = 60*1
  const time = parseInt(new Date().getTime()/1000);
  
  const taxDeclineSpan = 3600
  
  const icoTimestamps = [time + startSpan, time + startSpan + timespan * 1, time + startSpan + timespan * 2, time + startSpan + timespan * 3]
  const icoRates = [10000000, 6666666, 5000000]
  const maxPruchaesAmount = web3.utils.toWei("10", "ether")
  const minPruchaseAmount = web3.utils.toWei("1", "ether")
  const maxIcoAmount = web3.utils.toWei("1000000000", "ether")
  
  
    // ----- Automatic Setup ----
    
    
    // ** ---- Monkey Token ---- **
    if(deployMonkeyMoon){
      await deployer.deploy(MonkeyMoonToken)      
    }   
    let token 
    try{
      token = await MonkeyMoonToken.deployed()
    }catch(error){
      console.log("Main contract not deployed")
      return
    }

    // ** ---- ICO ----  **
    if(deployICO){
      await deployer.deploy(ICO, token.address, icoTimestamps, icoRates, maxPruchaesAmount, minPruchaseAmount, maxIcoAmount)
    }    
   
    let ico 
    try{
      ico = await ICO.deployed()
    }catch(error){
      console.log("ICO not deployed")
    }

    // ** ---- Taxes ---- **
    if(deployTaxes){
      await deployer.deploy(Taxes, token.address)
    } 

    let taxes 
    try{
      taxes = await Taxes.deployed()
    }catch(error){
      console.log("Taxes not deployed")
    }
    

    // ** ---- NFT ---- **
    if(deployNFT){
      await deployer.deploy(NFT)
    }  

    let nft 
    try{
      nft = await NFT.deployed()
    }catch(error){
      console.log("NFT not deployed")
    }

    if(deployNFTOffical){
      await deployer.deploy(NFTOffical)
    }  
    console.log("HERE")
    try{
      nft = await NFTOffical.deployed()
    }catch(error){
      console.log(error)
      console.log("NFT Offical not deployed")
    }

    // ** ----- Post Deployment ---- **
    if(deployICO){
      token.setICOAddress(ico.address) 
      token.increaseAllowance(ico.address, maxIcoAmount)
    }  
    if(deployTaxes){
      token.setTaxesAddress(taxes.address)
      token.setVaultTaxless()

      const timestamps = await ico.getTimestamps()
      const timestampsInt = []
      for(var i=0; i<timestamps.length; i++){
        timestampsInt.push(parseInt(timestamps[i]))      
      }
      token.setTaxStartEnd([timestampsInt[timestampsInt.length - 1], timestampsInt[timestampsInt.length - 1] + taxDeclineSpan])
    }     
    
 


  // ---- Manual Setup ----

  // const deployMonkeyMoon = prompt("Depoly Monkey Moon");
  // ** ---- Monkey Token ---- **    
  // await deployer.deploy(MonkeyMoonToken)

  // ** ---- ICO ----  **
  // const icoTimestamps = [1641996334, 1641997334, 1641998334]
  // await deployer.deploy(ICO, "0xba3A2c839402F20e09Aaa8be621C6bDcf052eE32", icoTimestamps, [1000, 500])

  // ** ---- Taxes ---- **
  // await deployer.deploy(Taxes, "0xba3A2c839402F20e09Aaa8be621C6bDcf052eE32")

  // ** ---- NFT ---- **
  // await deployer.deploy(NFT)
  
};
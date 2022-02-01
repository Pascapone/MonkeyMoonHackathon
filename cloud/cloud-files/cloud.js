// import Moralis from 'moralis'

// Moralis.Cloud.define("Webhook", async (request) => {  

//   const Monster = Moralis.Object.extend("Routes");
//   const query = new Moralis.Query(Monster);
//   query.equalTo("routeName", "Backend");
//   const results = await query.first()

//   const url = `$http://cc46-2a02-8108-97bf-d870-5605-dbff-fe6b-a275.ngrok.io/webhook`

//   Moralis.Cloud.httpRequest({
//     method : 'POST',
//     url : url,
//     headers : {
//       'Content-Type' : 'application/json'
//     },
//     body : {
//       age : 20,
//       request : request,
//       test : 'test',
//       backend : results
//     }
//   })
// });


const PERSONAL_INVITE_SCORE = 20
const INVITE_LINK_SCORE = 5

Moralis.Cloud.define("rewardTelegramRecruiter", async (request) => {

  const config = await Moralis.Config.get({useMasterKey: true});
  const telegram_api_key = config.get("TELEGRAM_MORALIS_API_KEY")

  const apiKey = request.params.telegramApiKey
  const ethAddress = request.params.ethAddress
  const personalInvite = request.params.personalInvite

  if(apiKey !== telegram_api_key) return "API-Key invalid"

  const userQuery = new Moralis.Query("_User")
  userQuery.equalTo("ethAddress", ethAddress)
  const user = await userQuery.first({ useMasterKey: true })

  if(!user) return "User not found"

  user.increment("claimScore", personalInvite ? PERSONAL_INVITE_SCORE : INVITE_LINK_SCORE)
  user.save(null, {useMasterKey : true})
  
  return "Success"

},{
  fields : [
    "telegramApiKey",
    "ethAddress",
    "personalInvite"
  ]
})

Moralis.Cloud.define("likeNft", async (request) => {
  	
  const user = request.user;
  const objectId = request.params.objectId;
  
  const nftQuery = new Moralis.Query("MonkeyMoonNFT")
  nftQuery.equalTo("objectId", objectId)

  const nft = await nftQuery.first()

  const usersLiked = nft.get("likes")

  if(!nft){
    return false
  }

  if(usersLiked.includes(user.id)){
    nft.remove("likes", user.id)
    user.decrement("claimScore", 3)
  }
  else{    
    nft.addUnique("likes", user.id)
    user.increment("claimScore", 3)
  }

  nft.save()
  user.save(null, {useMasterKey : true})

  return true
},

  {
    fields : ["objectId"],
    requireUser: true
  }
);

Moralis.Cloud.define("confirmTelegram", async (request) => {
  	
  const user = request.user
  const signature = request.params.signature
  const telegramUserId  = request.params.telegramUserId
  
  const telegramUserQuery = new Moralis.Query("telegramUser")
  telegramUserQuery.equalTo("objectId", telegramUserId)
  const telegramUser = await telegramUserQuery.first() 
  
  const signMessageUserQuery = new Moralis.Query("signMessage")
  signMessageUserQuery.equalTo("telegramUser", telegramUser)
  
  const signMessageSubjectQuery = new Moralis.Query("signMessage")
  signMessageSubjectQuery.equalTo("subject", "Telegram Link")
  
  const mainQuery = Moralis.Query.and(
    signMessageUserQuery,
    signMessageSubjectQuery
  );

  
  const signMessage = await mainQuery.first()
  
  const web3 = Moralis.web3ByChain("0x539");
  const address = web3.eth.accounts.recover(signMessage.get('message'), signature)
  
  if(address.toLowerCase() === user.get("ethAddress")){
  	user.set("telegramUser", telegramUser)
    await user.save(null, {useMasterKey:true})
    
    telegramUser.set("user", user)
    await telegramUser.save(null, {useMasterKey:true})
    
    signMessage.set("signed", true)
    signMessage.set("user", user)
    await signMessage.save(null, {useMasterKey:true})
    
    return true
  }
  else{
  	return false
  }
},

  {
    fields : ["signature", "telegramUserId"],
    requireUser: true
  }
);

Moralis.Cloud.define("getClaimScore", async (request) => {  
  const user = request.user
  const ethAddress = request.params.ethAddress

  if(user){
    const score = await user.get("claimScore", {useMasterKey : true})
    return score
  }
  else if(ethAddress){
    const userQuery = new Moralis.Query("_User")
    userQuery.equalTo("ethAddress", ethAddress)
    const queriedUser = await userQuery.first({useMasterKey : true})

    if(!queriedUser) return 0

    const score = queriedUser.get("claimScore", {useMasterKey : true})
    return score
  }
  
  return 0 
})

Moralis.Cloud.define("removeClaimScore", async (request) => {  
  const apiKey = request.params.oracleApiKey
  const ethAddress = request.params.ethAddress

  const config = await Moralis.Config.get({useMasterKey: true});
  const oracleApiKey = config.get("ORACLE_MORALIS_API_KEY")

  if(oracleApiKey !== apiKey) return "Invalid API-key"

  const userQuery = new Moralis.Query("_User")
  userQuery.equalTo("ethAddress", ethAddress)
  const user = await userQuery.first({useMasterKey : true})

  if(user){
    user.set("claimScore", 0)
    user.save(null, {useMasterKey : true})
    return "Success"
  }

  return "Failed to find user"
  
},{
  fields : [
    "oracleApiKey",
    "ethAddress"
  ]
})

Moralis.Cloud.define("restoreClaimScore", async (request) => {  
  const apiKey = request.params.oracleApiKey
  const ethAddress = request.params.ethAddress
  const score = request.params.score

  const config = await Moralis.Config.get({useMasterKey: true});
  const oracleApiKey = config.get("ORACLE_MORALIS_API_KEY")

  if(oracleApiKey !== apiKey) return "Invalid API-key"

  const userQuery = new Moralis.Query("_User")
  userQuery.equalTo("ethAddress", ethAddress)
  const user = await userQuery.first({useMasterKey : true})

  if(user){
    user.set("claimScore", score)
    user.save(null, {useMasterKey : true})
    return "Success"
  }

  return "Failed to find user"
  
},{
  fields : [
    "oracleApiKey",
    "ethAddress",
    "score"
  ]
  
})
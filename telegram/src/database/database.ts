import Moralis from 'moralis/node'
import crypto from 'crypto'
import { WalletLinkConfimationStatus } from '../interfaces/Status';

export const connectMoralis = async () => {
  await Moralis.start({ serverUrl : process.env.MORALIS_SERVER_URL, appId : process.env.MORALIS_APPLICATION_ID, masterKey : process.env.MORALIS_MASTER_KEY });
}

export const getUserByAddress = async (address : String) => {
  const User = Moralis.Object.extend("User")
  const query = new Moralis.Query(User);
  query.equalTo("ethAddress", address.toLowerCase())
  const result = await query.first({useMasterKey:true});
  return result
}

export const getTelegramUserById = async (telegramId : Number) => {
  const User = Moralis.Object.extend("telegramUser")
  const query = new Moralis.Query(User);
  query.include("signMessage")
  query.equalTo("telegramId", telegramId)
  const result = await query.first({useMasterKey:true});
  return result
}
export const createTelegramUser = async (telegramId : Number, username : string | undefined, first_name : string | undefined, recruiter : Moralis.Object | undefined) => {
  const User = Moralis.Object.extend("telegramUser")
  const telegramUser = new User()
  telegramUser.set('telegramId', telegramId)
  telegramUser.set('username', username)
  telegramUser.set('firstName', first_name)
  
  if(recruiter){
    telegramUser.set('invitedBy', recruiter)
  }
  
  telegramUser.save(null, {useMasterKey:true}) 
}

export type LinkWalletResponse = "already-linked" | "success" | "no-telegram-account"
export const linkWalletAddress = async (telegramId : number, walletAddress : string, telegramUsername : string | undefined, telegramFirstName : string) : Promise<LinkWalletResponse> => {
  const telegramUser = await getTelegramUserById(telegramId)
  if(telegramUser){   

    const TelegramUser = Moralis.Object.extend("telegramUser")
    const query = new Moralis.Query(TelegramUser);   
    query.equalTo("ethAddress", walletAddress.toLowerCase())
    const result = await query.find();
    console.log(result)
    for (let i = 0; i < result.length; i++) {      
      if(result[i].get("user")){
        return "already-linked"
      }
    }

    const SignMessage = Moralis.Object.extend('signMessage')
    const signMessage = new SignMessage()
    signMessage.set('subject', 'Telegram Link')
    signMessage.set('message', `I want to link my wallet to my telegram account.\nNonce:\n${crypto.randomBytes(16).toString('base64')}`)
    signMessage.set('telegramUser', telegramUser)
    signMessage.set('signed', false)
    await signMessage.save()

    telegramUser.set('ethAddress', walletAddress.toLowerCase())
    telegramUser.set('signMessage', signMessage)
    await telegramUser.save()

    const Notification = Moralis.Object.extend('notification')
    const notification = new Notification()
    notification.set('subject', 'Telegram Link')
    notification.set('text', `You need to confirm your telegram link to your wallet. 
#### The telegram username is: **${telegramUsername}**  
#### The first name is: **${telegramFirstName}**`)
    notification.set('warning', 'Important: You can not revert this action! Once you linked your wallet address to your telegram account, you can not link a new telegram account to your wallet! You will still be able to remove the link, but you will not be able to establish a new one!')
    notification.set('image', 'https://pascapone.github.io/kette.png')
    notification.set('type', 'sign')
    notification.set('telegramUser', telegramUser)
    notification.set('opened', false)
    notification.set('signMessage', signMessage)
    await notification.save()

    return "success"
  }
  else{
    return "no-telegram-account"
  }
}

export const deleteWalletLink = async (telegramId : number) : Promise<Boolean> => {
  const telegramUser = await getTelegramUserById(telegramId)
  if(telegramUser){
    telegramUser.unset('ethAddress')
    telegramUser.unset('signMessage')
    telegramUser.save()
    console.log("Removed")
    return true
  }
  else{
    return false
  }
}

export const getWalletLinkConfirmationStatus = async (telegramId : number) : Promise<WalletLinkConfimationStatus> => {
  const telegramUser = await getTelegramUserById(telegramId)
  if(telegramUser){
    const signMessage = telegramUser.get('signMessage')
    if(!signMessage){
      return "not-linked"
    }
    else if(signMessage && signMessage.get('signed')){
      return "confirmed"
    } 
    return "not-confirmed"
  }
  else{
    return "user-unknown"
  }
}

export const giveRewardToRecruiter = async (telegramId : number, personalInvite : boolean) => {
  const telegramUser = await getTelegramUserById(telegramId)
  console.log(process.env.TELEGRAM_MORALIS_API_KEY)

  if(!telegramUser) return

    
  const response = await Moralis.Cloud.run("rewardTelegramRecruiter", {
    telegramApiKey : process.env.TELEGRAM_MORALIS_API_KEY,
    ethAddress : telegramUser.get("ethAddress"),      
    personalInvite : personalInvite
  })   
  console.log(response) 
}

// export const whitelistTelegramUser = async (telegramId : number) : Promise<boolean> => {
//   const telegramUser = await getTelegramUserById(telegramId)
//   if(telegramUser){
//     telegramUser.set('whitelisted', true)
//     telegramUser.save()
//     return true
//   }
//   else{
//     return false
//   }  
// }
import { Context } from 'grammy'
import PrivateState from '../../../interfaces/State'
import { PrivateRoutes } from "../../../interfaces/PrivateState"
import { MonkeyContext } from '../../../interfaces/MonkeyContext'
import State from '../../../interfaces/State'
import { walletMenu } from '../../menu/walletMenu'
import InputWalletState from '../inputStates/InputWalletState'
import RemoveWalletState from '../decisionStates/RemoveWalletState'
import { OrangoutangStickers } from '../../../interfaces/Stickers'
import { changeScene } from '../../../interfaces/Stickers'
import { getTelegramUserById } from '../../../database/database'
class InviteMenuState implements PrivateState {
  route : PrivateRoutes

  constructor(){
    this.route = 'invite-menu'
  }

  async onEnter(ctx : MonkeyContext, prevState : PrivateState){   
    changeScene(ctx, OrangoutangStickers.lookout)
    return this
  }

  async onExit(ctx : MonkeyContext, nextState : PrivateState){
    return this
  }

  async onInput(ctx : MonkeyContext){ 
    changeScene(ctx, OrangoutangStickers.lookout) 

    ctx.session.privateContext.clearMsgs(ctx)

    const button = ctx.session.privateContext.clickedButton
    if(!button) return this
    
    switch (button) {
      case 'get-invite-link':
        ctx.session.privateContext.clickedButton = undefined
        getInviteLink(ctx)
        return this   
      case 'get-invite-info':
        ctx.session.privateContext.clickedButton = undefined
        const msg = await ctx.reply('Info about the invite system.')
        ctx.session.privateContext.msgIds.push(msg.message_id)
        return this 
      default:
        break;
    }
    return this
  }
}

const getInviteLink = async (ctx : MonkeyContext) => {
  if(!ctx.from) return
  
  const telegramUser = await getTelegramUserById(ctx.from.id)
  if(telegramUser){
    let inviteLink = telegramUser.get('telegramInviteLink')
    let walletAddress = telegramUser.get('ethAddress')
    let user = telegramUser.get('user')
    if(inviteLink){
      const msg = await ctx.reply(`Your personal invite link:\n${inviteLink}`)
      ctx.session.privateContext.msgIds.push(msg.message_id)
    }
    else{     
      inviteLink = await ctx.api.createChatInviteLink(Number(process.env.GROUP_CHAT_ID), {name : ctx.from.id.toString()})    
      telegramUser.set('telegramInviteLink', inviteLink.invite_link)
      telegramUser.save()
      const msg = await ctx.reply(`Your personal invite link:\n${inviteLink.invite_link}`)
      ctx.session.privateContext.msgIds.push(msg.message_id)
    }     

    if(!walletAddress){
      const msg = await ctx.reply(`Your wallet is currently not linked to your telegram account. You can not accumulate any Monkey Score as long as your wallet is not linked.`)
      ctx.session.privateContext.msgIds.push(msg.message_id)
    }
    else if(!user){
      const msg = await ctx.reply(`Your wallet is not confirmed. You can not accumulate any Monkey Score as long as your wallet is not confirmed.\nPlease vist www.app.monkeymoon.club to confirm your wallet.`)
      ctx.session.privateContext.msgIds.push(msg.message_id)
    }       
  }
  else{
    const msg = await ctx.reply(`You are not a member of the club!\nPlease join ${process.env.PUBLIC_INVITE_LINK}`)
    ctx.session.privateContext.msgIds.push(msg.message_id)
  }
}

export default InviteMenuState
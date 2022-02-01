import { Context } from 'grammy'
import PrivateState from '../../../interfaces/State'
import { PrivateRoutes } from "../../../interfaces/PrivateState"
import { MonkeyContext } from '../../../interfaces/MonkeyContext'
import State from '../../../interfaces/State'
import { ethers } from 'ethers'
import WalletMenuState from '../../states/menuStates/WalletMenuState'
import { OrangoutangStickers } from '../../../interfaces/Stickers'
import { changeScene } from '../../../interfaces/Stickers'
import { linkWalletAddress } from '../../../database/database'
import { getWalletLinkConfirmationStatus } from '../../../database/database'

class InputWalletState implements PrivateState {
  route : PrivateRoutes

  constructor(){
    this.route = 'input'
  }

  async onEnter(ctx : MonkeyContext, prevState : PrivateState) : Promise<State>{ 
    if(ctx.from){
      const status = await getWalletLinkConfirmationStatus(ctx.from.id)
      if(status === 'confirmed'){
        const msg = await ctx.reply('Your wallet address has already been confirmed. You can not change your wallet address at this point. This is due to our Monkey Score system, that could be exploited otherwise.')
        ctx.session.privateContext.msgIds.push(msg.message_id)
        return new WalletMenuState()
      }
    }    
     
    const msg = await ctx.reply('Please enter your wallet address')
    ctx.session.privateContext.msgIds.push(msg.message_id)
    return this
  }

  async onExit(ctx : MonkeyContext, nextState : PrivateState){    
    return this
  }

  async onInput(ctx : MonkeyContext){
    if(ctx.menu){
      return new WalletMenuState()      
    }

    if(!ctx.msg?.text){
      ctx.deleteMessage()
      let msg = await ctx.reply("Not a valid wallet address")
      ctx.session.privateContext.msgIds.push(msg.message_id)
      return new WalletMenuState()
    }
    const valid = ethers.utils.isAddress(ctx.msg.text)
    if(valid){
      if(!ctx.from){
        let msg = await ctx.reply(`Sry internal error.`)
        ctx.session.privateContext.msgIds.push(msg.message_id)
        ctx.session.privateContext.msgIds.push(ctx.msg.message_id)
        return new WalletMenuState()
      }
      const linked = await linkWalletAddress(ctx.from.id, ctx.msg.text, ctx.from.username, ctx.from.first_name)
  
      let msg
      if(linked === 'success'){
        msg = await ctx.reply(`Your wallet has been successfully linked to your telegram account.\nPlease visit www.app.monkeymoon.club to confirm that this is your wallet.`)
        changeScene(ctx, OrangoutangStickers.dancing)
      }
      else if(linked === 'no-telegram-account'){
        msg = await ctx.reply(`Sry we I don't know you!\nPlease join the club ${process.env.PUBLIC_INVITE_LINK}`)
      }
      else if(linked === 'already-linked'){
        msg = await ctx.reply(`There is already a confirmed link for this wallet address!`)
      }
      else{
        msg = await ctx.reply(`Sry, internal server error!`)
      }

      ctx.session.privateContext.msgIds.push(msg.message_id)
      ctx.session.privateContext.msgIds.push(ctx.msg.message_id)
    }
    else{
      ctx.deleteMessage()

      changeScene(ctx,  OrangoutangStickers.nono)
     
      if(ctx.chat){  
        let msg = await ctx.reply(`<b>${ctx.msg.text}</b> is not a valid wallet address`, {parse_mode : "HTML"})
        ctx.session.privateContext.msgIds.push(msg.message_id)
      }
    }   
    return new WalletMenuState()
    
  }
}

export default InputWalletState
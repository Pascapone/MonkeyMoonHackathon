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
import { getWalletLinkConfirmationStatus } from '../../../database/database'

class IcoMenuState implements PrivateState {
  route : PrivateRoutes

  constructor(){
    this.route = 'invite-menu'
  }

  async onEnter(ctx : MonkeyContext, prevState : PrivateState){   
    changeScene(ctx, OrangoutangStickers.waving)
    return this
  }

  async onExit(ctx : MonkeyContext, nextState : PrivateState){
    return this
  }

  async onInput(ctx : MonkeyContext){ 
    changeScene(ctx, OrangoutangStickers.waving) 

    ctx.session.privateContext.clearMsgs(ctx)

    const button = ctx.session.privateContext.clickedButton
    if(!button) return this
    
    switch (button) {
      case 'get-ico-info':
        ctx.session.privateContext.clickedButton = undefined   
        const msg = await ctx.reply('Info about the ICO.')  
        ctx.session.privateContext.msgIds.push(msg.message_id)
        return this   
      case 'whitelist':
        whitelistUser(ctx)
        ctx.session.privateContext.clickedButton = undefined
        return this 
      default:
        break;
    }
    return this
  }
}

const whitelistUser = async (ctx : MonkeyContext) => {
  if(ctx.from){
    const confirmationStatus = await getWalletLinkConfirmationStatus(ctx.from.id)
    if(confirmationStatus === 'confirmed'){
      const msg = await ctx.reply("You are whitelisted for the upcoming ICO")
      ctx.session.privateContext.msgIds.push(msg.message_id)
    }
    else{
      const msg = await ctx.reply("You have to link your wallet to your telegram account to be eligible for the ICO.")
      ctx.session.privateContext.msgIds.push(msg.message_id)
    }
  }  
}

export default IcoMenuState
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
import { getWalletLinkConfirmationStatus } from '../../../database/database'

class WalletMenuState implements PrivateState {
  route : PrivateRoutes

  constructor(){
    this.route = 'wallet-menu'
  }

  async onEnter(ctx : MonkeyContext, prevState : PrivateState){   
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
      case 'link-wallet':
        ctx.session.privateContext.clickedButton = undefined
        return new InputWalletState()        
      case 'remove-link':
        ctx.session.privateContext.clickedButton = undefined
        return new RemoveWalletState() 
      case 'get-wallet-confimation-status':
        ctx.session.privateContext.clickedButton = undefined
        await checkWalletConfirmationStatus(ctx)
        return this 
      default:
        break;
    }
    return this
  }
}

const checkWalletConfirmationStatus = async (ctx : MonkeyContext) => {
  if(ctx.from?.id){
    const confirmationStatus = await getWalletLinkConfirmationStatus(ctx.from.id)

    let msg
    switch (confirmationStatus) {
      case "confirmed":
        msg = await ctx.reply("Your wallet link has been confirmed.")
        ctx.session.privateContext.msgIds.push(msg.message_id)
        changeScene(ctx, OrangoutangStickers.thumbs)
        break;
      case "not-confirmed":
        msg = await ctx.reply("Your wallet link has <b>not</b> been confirmed!\nPlease visit www.app.monkeymoon.club to confirm your wallet link.", {parse_mode : 'HTML'})
        ctx.session.privateContext.msgIds.push(msg.message_id)
        changeScene(ctx, OrangoutangStickers.nono)
        break;
      case "user-unknown":
        msg = await ctx.reply(`You are not a member of the club. Join our telegram group.\n${process.env.PUBLIC_INVITE_LINK}`, {parse_mode : 'HTML'})
        ctx.session.privateContext.msgIds.push(msg.message_id)
        changeScene(ctx, OrangoutangStickers.nono)
        break;
      case "not-linked":
        msg = await ctx.reply(`Your wallet is not yet linked`, {parse_mode : 'HTML'})
        ctx.session.privateContext.msgIds.push(msg.message_id)
        changeScene(ctx, OrangoutangStickers.nono)
        break;
      default:
        break;
    }

  
  }    
}

export default WalletMenuState
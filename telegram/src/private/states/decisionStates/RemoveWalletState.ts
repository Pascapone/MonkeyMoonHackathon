import { Context, InlineKeyboard } from 'grammy'
import PrivateState from '../../../interfaces/State'
import { PrivateRoutes } from "../../../interfaces/PrivateState"
import { MonkeyContext } from '../../../interfaces/MonkeyContext'
import State from '../../../interfaces/State'
import { Menu } from '@grammyjs/menu'
import WalletMenuState from '../menuStates/WalletMenuState'
import { deleteWalletLink } from '../../../database/database'
import { changeScene, OrangoutangStickers } from '../../../interfaces/Stickers'

export const removeLinkDecision = new Menu<MonkeyContext>("Remove Link Decision")
  .text("Yes", async (ctx) => {
    const linkRemoved = await deleteWalletLink(ctx.from.id)
    ctx.session.privateContext.clearMsgs(ctx)
    let msg
    if(linkRemoved){      
      changeScene(ctx, OrangoutangStickers.crying)
      msg = await ctx.reply("Your wallet link has been removed.")      
    }
    else{
      msg = await ctx.reply(`Sry we I don't know you!\nPlease join the club ${process.env.PUBLIC_INVITE_LINK}`)
    }
    ctx.session.privateContext.msgIds.push(msg.message_id)
    ctx.session.privateContext.stateMachine.switchState(ctx, new WalletMenuState())    
  })
  .text("No", async (ctx) => {
    ctx.session.privateContext.clearMsgs(ctx)
    changeScene(ctx, OrangoutangStickers.dancing)
    const msg = await ctx.reply("Nice! Your still going bananas 🍌")
    ctx.session.privateContext.msgIds.push(msg.message_id)
    ctx.session.privateContext.stateMachine.switchState(ctx, new WalletMenuState())
  })


class RemoveWalletState implements PrivateState {
  route : PrivateRoutes

  constructor(){
    this.route = 'decision'
  }

  async onEnter(ctx : MonkeyContext, prevState : PrivateState){
    changeScene(ctx, OrangoutangStickers.smoking)
    const msg = await ctx.reply("Are you sure you want to remove your wallet link? You will not gain anymore Monkey Score from telegram!", {reply_markup : removeLinkDecision})
    ctx.session.privateContext.msgIds.push(msg.message_id)
    return this
  }

  async onExit(ctx : MonkeyContext, nextState : PrivateState){    
    return this
  }

  async onInput(ctx : MonkeyContext){
    // if(!ctx.menu) ctx.deleteMessage()
    return this
  }
}

export default RemoveWalletState
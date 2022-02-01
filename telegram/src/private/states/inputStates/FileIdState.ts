import { Context } from 'grammy'
import PrivateState from '../../../interfaces/State'
import { PrivateRoutes } from "../../../interfaces/PrivateState"
import { MonkeyContext } from '../../../interfaces/MonkeyContext'
import RootMenuState from '../menuStates/RootMenuState'
import { rootMenu } from '../../menu/rootMenu'
import { OrangoutangStickers } from '../../../interfaces/Stickers'


class FileIdState implements PrivateState {
  route : PrivateRoutes

  constructor(){
    this.route = 'input'
  }

  async onEnter(ctx : MonkeyContext, prevState : PrivateState){
    console.log("INPUT")
    // const image = 'https://media.npr.org/assets/img/2021/08/11/gettyimages-1279899488_wide-f3860ceb0ef19643c335cb34df3fa1de166e2761-s1100-c50.jpg'
    // const message = `<a href="${image}">&\\#8205;</a>`
    // console.log(message)
    // ctx.reply(message, {parse_mode : 'HTML'})
    // if(ctx.chat && ctx.session.privateContext.messageMenuId){
    //   const copied = await ctx.api.copyMessage(ctx.chat.id, ctx.chat.id, ctx.session.privateContext.messageMenuId, { reply_markup : rootMenu})
    //   await ctx.api.deleteMessage(ctx.chat.id, ctx.session.privateContext.messageMenuId)      
    //   ctx.session.privateContext.messageMenuId = copied.message_id
    // }
    
 

    return this
  }

  async onExit(ctx : MonkeyContext, nextState : PrivateState){
    return this
  }

  async onInput(ctx : MonkeyContext){ 
    
    // const privateContext = ctx.session.privateContext

    // const stickerId = privateContext.rebuildSticker

    // const stickerResponse = await ctx.replyWithSticker(stickerId) 
     
    // const menuResponse = await ctx.reply("Main Menu", {
    //   reply_markup: rootMenu
    // });

    // ctx.session.privateContext.messageMenuId = menuResponse.message_id
    // ctx.session.privateContext.messageStickerId = stickerResponse.message_id

    // ctx.session.privateContext.currentMenuRoute = 'root-menu'

    // ctx.menu.nav('root-menu')
    console.log("File State")
    console.log(ctx.msg)
    if(ctx.msg){
      ctx.session.privateContext.msgIds.push(ctx.msg.message_id)
      if(ctx.msg.document){
        const msg = await ctx.reply(ctx.msg.document.file_id)
        ctx.session.privateContext.msgIds.push(msg.message_id)
      }
    }

    return new RootMenuState()
  }
}

export default FileIdState
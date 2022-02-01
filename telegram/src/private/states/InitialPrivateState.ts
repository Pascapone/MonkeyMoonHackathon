import { Context } from 'grammy'
import PrivateState from '../../interfaces/State'
import { PrivateRoutes } from "../../interfaces/PrivateState"
import { MonkeyContext } from '../../interfaces/MonkeyContext'
import RootMenuState from './menuStates/RootMenuState'
import { rootMenu } from '../menu/rootMenu'
import { OrangoutangStickers } from '../../interfaces/Stickers'

class InitialPrivateState implements PrivateState {
  route : PrivateRoutes

  constructor(){
    this.route = 'initial'
  }

  async onEnter(ctx : MonkeyContext, prevState : PrivateState){
    
    return this
  }

  async onExit(ctx : MonkeyContext, nextState : PrivateState){
    return this
  }

  async onInput(ctx : MonkeyContext){

    await ctx.reply(`Welcome!
We start the session!`); 
    
    // const stickerSet = await ctx.api.getStickerSet("Orangoutang")

    // stickerSet.stickers.forEach((st) => {
    //   console.log(`"${st.file_id}",`)
    // })

    // const sticker = stickerSet.stickers[4]

    // const stickerResponse = await ctx.replyWithSticker(sticker.file_id) 
     
    const stickerResponse = await ctx.replyWithAnimation(OrangoutangStickers.waving)
    ctx.session.privateContext.messageSceneFileId = OrangoutangStickers.waving

    const menuResponse = await ctx.reply("Main Menu", {
      reply_markup: rootMenu
    });

    ctx.session.privateContext.messageMenuId = menuResponse.message_id
    ctx.session.privateContext.messageSceneId = stickerResponse.message_id

    ctx.session.privateContext.currentMenuRoute = 'root-menu'

    return new RootMenuState()
  }
}

export default InitialPrivateState
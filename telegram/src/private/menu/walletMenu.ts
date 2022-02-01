import { Menu } from "@grammyjs/menu";
import { MonkeyContext } from "../../interfaces/MonkeyContext";
import { changeScene } from "../../interfaces/Stickers";
import RootMenuState from "../states/menuStates/RootMenuState";
import { buttonClicked } from "./buttons";
import { OrangoutangStickers } from "../../interfaces/Stickers";


// Wallet Menu
export const walletMenu = new Menu<MonkeyContext>("wallet-menu")
  .text("Link my wallet", async (ctx, next) => await buttonClicked(ctx, next, 'link-wallet'))
  .text("Remove wallet link", async (ctx, next) => await buttonClicked(ctx, next, 'remove-link')).row()
  .text("Confirmation Status", async (ctx, next) => {  
    await buttonClicked(ctx, next, 'get-wallet-confimation-status') 
  })
  .back("« Back ", (ctx) => {
    ctx.editMessageText("Main Menu")
    ctx.session.privateContext.clearMsgs(ctx)
    ctx.session.privateContext.stateMachine.switchState(ctx, new RootMenuState())
    ctx.session.privateContext.currentMenuRoute = 'root-menu'
    changeScene(ctx, OrangoutangStickers.waving)
  });



  // « »
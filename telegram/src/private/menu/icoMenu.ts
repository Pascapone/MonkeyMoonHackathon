import { Menu } from "@grammyjs/menu";
import { MonkeyContext } from "../../interfaces/MonkeyContext";
import RootMenuState from "../states/menuStates/RootMenuState";
import { buttonClicked } from "./buttons";
import { changeScene } from "../../interfaces/Stickers";
import { OrangoutangStickers } from "../../interfaces/Stickers";

// Root Menu
export const icoMenu = new Menu<MonkeyContext>("ico-menu")
  .text("Whitelist Me", async (ctx, next) => {  
    await buttonClicked(ctx, next, 'whitelist') 
  })
  .text("Info", async (ctx, next) => {  
    await buttonClicked(ctx, next, 'get-ico-info') 
  }).row()  
  .back("« Back ", (ctx) => {
    ctx.editMessageText("Main Menu")
    ctx.session.privateContext.clearMsgs(ctx)
    ctx.session.privateContext.stateMachine.switchState(ctx, new RootMenuState())
    ctx.session.privateContext.currentMenuRoute = 'root-menu'
    changeScene(ctx, OrangoutangStickers.waving)
  });




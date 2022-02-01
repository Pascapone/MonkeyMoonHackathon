import { Menu } from "@grammyjs/menu";
import { MonkeyContext } from "../../interfaces/MonkeyContext";
import RootMenuState from "../states/menuStates/RootMenuState";
import WalletMenuState from "../states/menuStates/WalletMenuState"
import { walletMenu } from "./walletMenu";
import { buttonClicked } from "./buttons";
import FielIdState from "../states/inputStates/FileIdState";
import { getTelegramUserById } from "../../database/database";
import { changeScene } from "../../interfaces/Stickers";
import { OrangoutangStickers } from "../../interfaces/Stickers";

// Root Menu
export const inviteMenu = new Menu<MonkeyContext>("invite-menu")
  .text("Get Invite Link", async (ctx, next) => {  
    await buttonClicked(ctx, next, 'get-invite-link') 
  })
  .text("Info", async (ctx, next) => {  
    await buttonClicked(ctx, next, 'get-invite-info') 
  }).row()  
  .back("« Back ", (ctx) => {
    ctx.editMessageText("Main Menu")
    ctx.session.privateContext.clearMsgs(ctx)
    ctx.session.privateContext.stateMachine.switchState(ctx, new RootMenuState())
    ctx.session.privateContext.currentMenuRoute = 'root-menu'
    changeScene(ctx, OrangoutangStickers.waving)
  });




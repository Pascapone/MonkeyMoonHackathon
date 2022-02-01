import { Menu } from "@grammyjs/menu";
import { MonkeyContext } from "../../interfaces/MonkeyContext";
import RootMenuState from "../states/menuStates/RootMenuState";
import WalletMenuState from "../states/menuStates/WalletMenuState"
import { walletMenu } from "./walletMenu";
import { buttonClicked } from "./buttons";
import FielIdState from "../states/inputStates/FileIdState";
import { getTelegramUserById } from "../../database/database";
import { inviteMenu } from "./inviteMenu";
import InviteMenuState from "../states/menuStates/InviteMenuState";
import { icoMenu } from "./icoMenu";
import IcoMenuState from "../states/menuStates/IcoMenuState";

// Root Menu
export const rootMenu = new Menu<MonkeyContext>("root-menu")
  .submenu("Invite Menu", 'invite-menu', async (ctx) => {  
    ctx.session.privateContext.clearMsgs(ctx)
    ctx.editMessageText("Invite Menu")
    ctx.session.privateContext.stateMachine.switchState(ctx, new InviteMenuState())
    ctx.session.privateContext.currentMenuRoute = 'invite-menu'
  })
  .submenu("ICO Menu", 'ico-menu', async (ctx) => {  
    ctx.session.privateContext.clearMsgs(ctx)
    ctx.editMessageText("ICO Menu")
    ctx.session.privateContext.stateMachine.switchState(ctx, new IcoMenuState())
    ctx.session.privateContext.currentMenuRoute = 'ico-menu'
  }).row()
  .submenu("Wallet Menu", "wallet-menu", (ctx) => {
    ctx.session.privateContext.clearMsgs(ctx)
    ctx.editMessageText("Wallet Menu")
    ctx.session.privateContext.stateMachine.switchState(ctx, new WalletMenuState())
    ctx.session.privateContext.currentMenuRoute = 'wallet-menu'
  });

export const registerMenus = () => {
  rootMenu.register(walletMenu)
  rootMenu.register(inviteMenu)
  rootMenu.register(icoMenu)
}


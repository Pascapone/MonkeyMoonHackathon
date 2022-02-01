"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMenus = exports.rootMenu = void 0;
const menu_1 = require("@grammyjs/menu");
const WalletMenuState_1 = __importDefault(require("../states/menuStates/WalletMenuState"));
const walletMenu_1 = require("./walletMenu");
const inviteMenu_1 = require("./inviteMenu");
const InviteMenuState_1 = __importDefault(require("../states/menuStates/InviteMenuState"));
const icoMenu_1 = require("./icoMenu");
const IcoMenuState_1 = __importDefault(require("../states/menuStates/IcoMenuState"));
// Root Menu
exports.rootMenu = new menu_1.Menu("root-menu")
    .submenu("Invite Menu", 'invite-menu', async (ctx) => {
    ctx.session.privateContext.clearMsgs(ctx);
    ctx.editMessageText("Invite Menu");
    ctx.session.privateContext.stateMachine.switchState(ctx, new InviteMenuState_1.default());
    ctx.session.privateContext.currentMenuRoute = 'invite-menu';
})
    .submenu("ICO Menu", 'ico-menu', async (ctx) => {
    ctx.session.privateContext.clearMsgs(ctx);
    ctx.editMessageText("ICO Menu");
    ctx.session.privateContext.stateMachine.switchState(ctx, new IcoMenuState_1.default());
    ctx.session.privateContext.currentMenuRoute = 'ico-menu';
}).row()
    .submenu("Wallet Menu", "wallet-menu", (ctx) => {
    ctx.session.privateContext.clearMsgs(ctx);
    ctx.editMessageText("Wallet Menu");
    ctx.session.privateContext.stateMachine.switchState(ctx, new WalletMenuState_1.default());
    ctx.session.privateContext.currentMenuRoute = 'wallet-menu';
});
const registerMenus = () => {
    exports.rootMenu.register(walletMenu_1.walletMenu);
    exports.rootMenu.register(inviteMenu_1.inviteMenu);
    exports.rootMenu.register(icoMenu_1.icoMenu);
};
exports.registerMenus = registerMenus;

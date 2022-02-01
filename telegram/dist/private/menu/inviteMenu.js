"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inviteMenu = void 0;
const menu_1 = require("@grammyjs/menu");
const RootMenuState_1 = __importDefault(require("../states/menuStates/RootMenuState"));
const buttons_1 = require("./buttons");
const Stickers_1 = require("../../interfaces/Stickers");
const Stickers_2 = require("../../interfaces/Stickers");
// Root Menu
exports.inviteMenu = new menu_1.Menu("invite-menu")
    .text("Get Invite Link", async (ctx, next) => {
    await (0, buttons_1.buttonClicked)(ctx, next, 'get-invite-link');
})
    .text("Info", async (ctx, next) => {
    await (0, buttons_1.buttonClicked)(ctx, next, 'get-invite-info');
}).row()
    .back("« Back ", (ctx) => {
    ctx.editMessageText("Main Menu");
    ctx.session.privateContext.clearMsgs(ctx);
    ctx.session.privateContext.stateMachine.switchState(ctx, new RootMenuState_1.default());
    ctx.session.privateContext.currentMenuRoute = 'root-menu';
    (0, Stickers_1.changeScene)(ctx, Stickers_2.OrangoutangStickers.waving);
});

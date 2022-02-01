"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeLinkDecision = void 0;
const menu_1 = require("@grammyjs/menu");
const WalletMenuState_1 = __importDefault(require("../menuStates/WalletMenuState"));
const database_1 = require("../../../database/database");
const Stickers_1 = require("../../../interfaces/Stickers");
exports.removeLinkDecision = new menu_1.Menu("Remove Link Decision")
    .text("Yes", async (ctx) => {
    const linkRemoved = await (0, database_1.deleteWalletLink)(ctx.from.id);
    ctx.session.privateContext.clearMsgs(ctx);
    let msg;
    if (linkRemoved) {
        (0, Stickers_1.changeScene)(ctx, Stickers_1.OrangoutangStickers.crying);
        msg = await ctx.reply("Your wallet link has been removed.");
    }
    else {
        msg = await ctx.reply(`Sry we I don't know you!\nPlease join the club ${process.env.PUBLIC_INVITE_LINK}`);
    }
    ctx.session.privateContext.msgIds.push(msg.message_id);
    ctx.session.privateContext.stateMachine.switchState(ctx, new WalletMenuState_1.default());
})
    .text("No", async (ctx) => {
    ctx.session.privateContext.clearMsgs(ctx);
    (0, Stickers_1.changeScene)(ctx, Stickers_1.OrangoutangStickers.dancing);
    const msg = await ctx.reply("Nice! Your still going bananas 🍌");
    ctx.session.privateContext.msgIds.push(msg.message_id);
    ctx.session.privateContext.stateMachine.switchState(ctx, new WalletMenuState_1.default());
});
class RemoveWalletState {
    constructor() {
        this.route = 'decision';
    }
    async onEnter(ctx, prevState) {
        (0, Stickers_1.changeScene)(ctx, Stickers_1.OrangoutangStickers.smoking);
        const msg = await ctx.reply("Are you sure you want to remove your wallet link? You will not gain anymore Monkey Score from telegram!", { reply_markup: exports.removeLinkDecision });
        ctx.session.privateContext.msgIds.push(msg.message_id);
        return this;
    }
    async onExit(ctx, nextState) {
        return this;
    }
    async onInput(ctx) {
        // if(!ctx.menu) ctx.deleteMessage()
        return this;
    }
}
exports.default = RemoveWalletState;

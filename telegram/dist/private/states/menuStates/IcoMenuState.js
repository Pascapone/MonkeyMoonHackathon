"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Stickers_1 = require("../../../interfaces/Stickers");
const Stickers_2 = require("../../../interfaces/Stickers");
const database_1 = require("../../../database/database");
class IcoMenuState {
    constructor() {
        this.route = 'invite-menu';
    }
    async onEnter(ctx, prevState) {
        (0, Stickers_2.changeScene)(ctx, Stickers_1.OrangoutangStickers.waving);
        return this;
    }
    async onExit(ctx, nextState) {
        return this;
    }
    async onInput(ctx) {
        (0, Stickers_2.changeScene)(ctx, Stickers_1.OrangoutangStickers.waving);
        ctx.session.privateContext.clearMsgs(ctx);
        const button = ctx.session.privateContext.clickedButton;
        if (!button)
            return this;
        switch (button) {
            case 'get-ico-info':
                ctx.session.privateContext.clickedButton = undefined;
                const msg = await ctx.reply('Info about the ICO.');
                ctx.session.privateContext.msgIds.push(msg.message_id);
                return this;
            case 'whitelist':
                whitelistUser(ctx);
                ctx.session.privateContext.clickedButton = undefined;
                return this;
            default:
                break;
        }
        return this;
    }
}
const whitelistUser = async (ctx) => {
    if (ctx.from) {
        const confirmationStatus = await (0, database_1.getWalletLinkConfirmationStatus)(ctx.from.id);
        if (confirmationStatus === 'confirmed') {
            const msg = await ctx.reply("You are whitelisted for the upcoming ICO");
            ctx.session.privateContext.msgIds.push(msg.message_id);
        }
        else {
            const msg = await ctx.reply("You have to link your wallet to your telegram account to be eligible for the ICO.");
            ctx.session.privateContext.msgIds.push(msg.message_id);
        }
    }
};
exports.default = IcoMenuState;

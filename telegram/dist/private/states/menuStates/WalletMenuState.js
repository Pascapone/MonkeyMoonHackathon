"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InputWalletState_1 = __importDefault(require("../inputStates/InputWalletState"));
const RemoveWalletState_1 = __importDefault(require("../decisionStates/RemoveWalletState"));
const Stickers_1 = require("../../../interfaces/Stickers");
const Stickers_2 = require("../../../interfaces/Stickers");
const database_1 = require("../../../database/database");
class WalletMenuState {
    constructor() {
        this.route = 'wallet-menu';
    }
    async onEnter(ctx, prevState) {
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
            case 'link-wallet':
                ctx.session.privateContext.clickedButton = undefined;
                return new InputWalletState_1.default();
            case 'remove-link':
                ctx.session.privateContext.clickedButton = undefined;
                return new RemoveWalletState_1.default();
            case 'get-wallet-confimation-status':
                ctx.session.privateContext.clickedButton = undefined;
                await checkWalletConfirmationStatus(ctx);
                return this;
            default:
                break;
        }
        return this;
    }
}
const checkWalletConfirmationStatus = async (ctx) => {
    if (ctx.from?.id) {
        const confirmationStatus = await (0, database_1.getWalletLinkConfirmationStatus)(ctx.from.id);
        let msg;
        switch (confirmationStatus) {
            case "confirmed":
                msg = await ctx.reply("Your wallet link has been confirmed.");
                ctx.session.privateContext.msgIds.push(msg.message_id);
                (0, Stickers_2.changeScene)(ctx, Stickers_1.OrangoutangStickers.thumbs);
                break;
            case "not-confirmed":
                msg = await ctx.reply("Your wallet link has <b>not</b> been confirmed!\nPlease visit www.app.monkeymoon.club to confirm your wallet link.", { parse_mode: 'HTML' });
                ctx.session.privateContext.msgIds.push(msg.message_id);
                (0, Stickers_2.changeScene)(ctx, Stickers_1.OrangoutangStickers.nono);
                break;
            case "user-unknown":
                msg = await ctx.reply(`You are not a member of the club. Join our telegram group.\n${process.env.PUBLIC_INVITE_LINK}`, { parse_mode: 'HTML' });
                ctx.session.privateContext.msgIds.push(msg.message_id);
                (0, Stickers_2.changeScene)(ctx, Stickers_1.OrangoutangStickers.nono);
                break;
            case "not-linked":
                msg = await ctx.reply(`Your wallet is not yet linked`, { parse_mode: 'HTML' });
                ctx.session.privateContext.msgIds.push(msg.message_id);
                (0, Stickers_2.changeScene)(ctx, Stickers_1.OrangoutangStickers.nono);
                break;
            default:
                break;
        }
    }
};
exports.default = WalletMenuState;

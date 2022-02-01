"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const WalletMenuState_1 = __importDefault(require("../../states/menuStates/WalletMenuState"));
const Stickers_1 = require("../../../interfaces/Stickers");
const Stickers_2 = require("../../../interfaces/Stickers");
const database_1 = require("../../../database/database");
const database_2 = require("../../../database/database");
class InputWalletState {
    constructor() {
        this.route = 'input';
    }
    async onEnter(ctx, prevState) {
        if (ctx.from) {
            const status = await (0, database_2.getWalletLinkConfirmationStatus)(ctx.from.id);
            if (status === 'confirmed') {
                const msg = await ctx.reply('Your wallet address has already been confirmed. You can not change your wallet address at this point. This is due to our Monkey Score system, that could be exploited otherwise.');
                ctx.session.privateContext.msgIds.push(msg.message_id);
                return new WalletMenuState_1.default();
            }
        }
        const msg = await ctx.reply('Please enter your wallet address');
        ctx.session.privateContext.msgIds.push(msg.message_id);
        return this;
    }
    async onExit(ctx, nextState) {
        return this;
    }
    async onInput(ctx) {
        if (ctx.menu) {
            return new WalletMenuState_1.default();
        }
        if (!ctx.msg?.text) {
            ctx.deleteMessage();
            let msg = await ctx.reply("Not a valid wallet address");
            ctx.session.privateContext.msgIds.push(msg.message_id);
            return new WalletMenuState_1.default();
        }
        const valid = ethers_1.ethers.utils.isAddress(ctx.msg.text);
        if (valid) {
            if (!ctx.from) {
                let msg = await ctx.reply(`Sry internal error.`);
                ctx.session.privateContext.msgIds.push(msg.message_id);
                ctx.session.privateContext.msgIds.push(ctx.msg.message_id);
                return new WalletMenuState_1.default();
            }
            const linked = await (0, database_1.linkWalletAddress)(ctx.from.id, ctx.msg.text, ctx.from.username, ctx.from.first_name);
            let msg;
            if (linked === 'success') {
                msg = await ctx.reply(`Your wallet has been successfully linked to your telegram account.\nPlease visit www.app.monkeymoon.club to confirm that this is your wallet.`);
                (0, Stickers_2.changeScene)(ctx, Stickers_1.OrangoutangStickers.dancing);
            }
            else if (linked === 'no-telegram-account') {
                msg = await ctx.reply(`Sry we I don't know you!\nPlease join the club ${process.env.PUBLIC_INVITE_LINK}`);
            }
            else if (linked === 'already-linked') {
                msg = await ctx.reply(`There is already a confirmed link for this wallet address!`);
            }
            else {
                msg = await ctx.reply(`Sry, internal server error!`);
            }
            ctx.session.privateContext.msgIds.push(msg.message_id);
            ctx.session.privateContext.msgIds.push(ctx.msg.message_id);
        }
        else {
            ctx.deleteMessage();
            (0, Stickers_2.changeScene)(ctx, Stickers_1.OrangoutangStickers.nono);
            if (ctx.chat) {
                let msg = await ctx.reply(`<b>${ctx.msg.text}</b> is not a valid wallet address`, { parse_mode: "HTML" });
                ctx.session.privateContext.msgIds.push(msg.message_id);
            }
        }
        return new WalletMenuState_1.default();
    }
}
exports.default = InputWalletState;

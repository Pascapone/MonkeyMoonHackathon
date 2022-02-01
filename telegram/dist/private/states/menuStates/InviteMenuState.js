"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Stickers_1 = require("../../../interfaces/Stickers");
const Stickers_2 = require("../../../interfaces/Stickers");
const database_1 = require("../../../database/database");
class InviteMenuState {
    constructor() {
        this.route = 'invite-menu';
    }
    async onEnter(ctx, prevState) {
        (0, Stickers_2.changeScene)(ctx, Stickers_1.OrangoutangStickers.lookout);
        return this;
    }
    async onExit(ctx, nextState) {
        return this;
    }
    async onInput(ctx) {
        (0, Stickers_2.changeScene)(ctx, Stickers_1.OrangoutangStickers.lookout);
        ctx.session.privateContext.clearMsgs(ctx);
        const button = ctx.session.privateContext.clickedButton;
        if (!button)
            return this;
        switch (button) {
            case 'get-invite-link':
                ctx.session.privateContext.clickedButton = undefined;
                getInviteLink(ctx);
                return this;
            case 'get-invite-info':
                ctx.session.privateContext.clickedButton = undefined;
                const msg = await ctx.reply('Info about the invite system.');
                ctx.session.privateContext.msgIds.push(msg.message_id);
                return this;
            default:
                break;
        }
        return this;
    }
}
const getInviteLink = async (ctx) => {
    if (!ctx.from)
        return;
    const telegramUser = await (0, database_1.getTelegramUserById)(ctx.from.id);
    if (telegramUser) {
        let inviteLink = telegramUser.get('telegramInviteLink');
        let walletAddress = telegramUser.get('ethAddress');
        let user = telegramUser.get('user');
        if (inviteLink) {
            const msg = await ctx.reply(`Your personal invite link:\n${inviteLink}`);
            ctx.session.privateContext.msgIds.push(msg.message_id);
        }
        else {
            inviteLink = await ctx.api.createChatInviteLink(Number(process.env.GROUP_CHAT_ID), { name: ctx.from.id.toString() });
            telegramUser.set('telegramInviteLink', inviteLink.invite_link);
            telegramUser.save();
            const msg = await ctx.reply(`Your personal invite link:\n${inviteLink.invite_link}`);
            ctx.session.privateContext.msgIds.push(msg.message_id);
        }
        if (!walletAddress) {
            const msg = await ctx.reply(`Your wallet is currently not linked to your telegram account. You can not accumulate any Monkey Score as long as your wallet is not linked.`);
            ctx.session.privateContext.msgIds.push(msg.message_id);
        }
        else if (!user) {
            const msg = await ctx.reply(`Your wallet is not confirmed. You can not accumulate any Monkey Score as long as your wallet is not confirmed.\nPlease vist www.app.monkeymoon.club to confirm your wallet.`);
            ctx.session.privateContext.msgIds.push(msg.message_id);
        }
    }
    else {
        const msg = await ctx.reply(`You are not a member of the club!\nPlease join ${process.env.PUBLIC_INVITE_LINK}`);
        ctx.session.privateContext.msgIds.push(msg.message_id);
    }
};
exports.default = InviteMenuState;

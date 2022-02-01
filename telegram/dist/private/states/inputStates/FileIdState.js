"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RootMenuState_1 = __importDefault(require("../menuStates/RootMenuState"));
class FileIdState {
    constructor() {
        this.route = 'input';
    }
    async onEnter(ctx, prevState) {
        console.log("INPUT");
        // const image = 'https://media.npr.org/assets/img/2021/08/11/gettyimages-1279899488_wide-f3860ceb0ef19643c335cb34df3fa1de166e2761-s1100-c50.jpg'
        // const message = `<a href="${image}">&\\#8205;</a>`
        // console.log(message)
        // ctx.reply(message, {parse_mode : 'HTML'})
        // if(ctx.chat && ctx.session.privateContext.messageMenuId){
        //   const copied = await ctx.api.copyMessage(ctx.chat.id, ctx.chat.id, ctx.session.privateContext.messageMenuId, { reply_markup : rootMenu})
        //   await ctx.api.deleteMessage(ctx.chat.id, ctx.session.privateContext.messageMenuId)      
        //   ctx.session.privateContext.messageMenuId = copied.message_id
        // }
        return this;
    }
    async onExit(ctx, nextState) {
        return this;
    }
    async onInput(ctx) {
        // const privateContext = ctx.session.privateContext
        // const stickerId = privateContext.rebuildSticker
        // const stickerResponse = await ctx.replyWithSticker(stickerId) 
        // const menuResponse = await ctx.reply("Main Menu", {
        //   reply_markup: rootMenu
        // });
        // ctx.session.privateContext.messageMenuId = menuResponse.message_id
        // ctx.session.privateContext.messageStickerId = stickerResponse.message_id
        // ctx.session.privateContext.currentMenuRoute = 'root-menu'
        // ctx.menu.nav('root-menu')
        console.log("File State");
        console.log(ctx.msg);
        if (ctx.msg) {
            ctx.session.privateContext.msgIds.push(ctx.msg.message_id);
            if (ctx.msg.document) {
                const msg = await ctx.reply(ctx.msg.document.file_id);
                ctx.session.privateContext.msgIds.push(msg.message_id);
            }
        }
        return new RootMenuState_1.default();
    }
}
exports.default = FileIdState;

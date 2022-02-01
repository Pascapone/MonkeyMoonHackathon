"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RootMenuState_1 = __importDefault(require("./menuStates/RootMenuState"));
const rootMenu_1 = require("../menu/rootMenu");
const Stickers_1 = require("../../interfaces/Stickers");
class InitialPrivateState {
    constructor() {
        this.route = 'initial';
    }
    async onEnter(ctx, prevState) {
        return this;
    }
    async onExit(ctx, nextState) {
        return this;
    }
    async onInput(ctx) {
        await ctx.reply(`Welcome!
We start the session!`);
        // const stickerSet = await ctx.api.getStickerSet("Orangoutang")
        // stickerSet.stickers.forEach((st) => {
        //   console.log(`"${st.file_id}",`)
        // })
        // const sticker = stickerSet.stickers[4]
        // const stickerResponse = await ctx.replyWithSticker(sticker.file_id) 
        const stickerResponse = await ctx.replyWithAnimation(Stickers_1.OrangoutangStickers.waving);
        ctx.session.privateContext.messageSceneFileId = Stickers_1.OrangoutangStickers.waving;
        const menuResponse = await ctx.reply("Main Menu", {
            reply_markup: rootMenu_1.rootMenu
        });
        ctx.session.privateContext.messageMenuId = menuResponse.message_id;
        ctx.session.privateContext.messageSceneId = stickerResponse.message_id;
        ctx.session.privateContext.currentMenuRoute = 'root-menu';
        return new RootMenuState_1.default();
    }
}
exports.default = InitialPrivateState;

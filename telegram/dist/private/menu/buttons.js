"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buttonClicked = void 0;
async function buttonClicked(ctx, next, button) {
    console.log("Button Clicked");
    ctx.session.privateContext.clearMsgs(ctx);
    ctx.session.privateContext.clickedButton = button;
    await next();
}
exports.buttonClicked = buttonClicked;

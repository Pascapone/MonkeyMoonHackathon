"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RootMenuState {
    constructor() {
        this.route = 'root-menu';
    }
    async onEnter(ctx, prevState) {
        return this;
    }
    async onExit(ctx, nextState) {
        return this;
    }
    async onInput(ctx) {
        ctx.session.privateContext.clearMsgs(ctx);
        return this;
    }
}
exports.default = RootMenuState;

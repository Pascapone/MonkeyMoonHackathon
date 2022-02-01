"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PrivateBlankoState {
    constructor() {
        this.route = 'blanko';
    }
    async onEnter(ctx, prevState) {
        return this;
    }
    async onExit(ctx, nextState) {
        return this;
    }
    async onInput(ctx) {
        return this;
    }
}
exports.default = PrivateBlankoState;

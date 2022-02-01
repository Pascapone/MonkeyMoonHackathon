"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MonkeyStateMachine {
    constructor(initialState) {
        this.currentState = initialState;
    }
    async onInput(ctx) {
        const state = await this.currentState.onInput(ctx);
        if (state === this.currentState)
            return;
        await this.switchState(ctx, state);
    }
    async switchState(ctx, newState) {
        await this.currentState.onExit(ctx, newState);
        const state = await newState.onEnter(ctx, this.currentState);
        if (state === newState) {
            this.currentState = newState;
        }
        else {
            this.switchState(ctx, state);
        }
    }
}
exports.default = MonkeyStateMachine;

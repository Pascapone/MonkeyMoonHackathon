import State from "./interfaces/State";
import { MonkeyContext } from "./interfaces/MonkeyContext";

class MonkeyStateMachine {
  currentState : State

  constructor(initialState : State){
    this.currentState = initialState
  }
  
  async onInput(ctx : MonkeyContext){    
    const state = await this.currentState.onInput(ctx)   
    
    if(state === this.currentState) return

    await this.switchState(ctx, state)
  }

  async switchState(ctx : MonkeyContext, newState : State){
    await this.currentState.onExit(ctx, newState)
    
    const state = await newState.onEnter(ctx, this.currentState)

    if(state === newState){
      this.currentState = newState
    }
    else{
      this.switchState(ctx, state)
    }    
  }
}

export default MonkeyStateMachine
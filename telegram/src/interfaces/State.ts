import { Context } from "grammy";
import { MonkeyContext } from "./MonkeyContext"

export interface OnEnter{
  (ctx : MonkeyContext, prevState : State) : Promise<State>
}

export interface OnExit{
  (ctx : MonkeyContext, nextState : State) : Promise<State>
}

export interface OnInput{
  (ctx : MonkeyContext) : Promise<State>
}

interface State {
  route : string
  onEnter : OnEnter
  onExit : OnExit
  onInput : OnInput
}

export default State
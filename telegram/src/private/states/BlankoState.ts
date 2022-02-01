import { Context } from 'grammy'
import PrivateState from '../../interfaces/State'
import { PrivateRoutes } from "../../interfaces/PrivateState"
import { MonkeyContext } from '../../interfaces/MonkeyContext'
import State from '../../interfaces/State'

class PrivateBlankoState implements PrivateState {
  route : PrivateRoutes

  constructor(){
    this.route = 'blanko'
  }

  async onEnter(ctx : MonkeyContext, prevState : PrivateState){
    return this
  }

  async onExit(ctx : MonkeyContext, nextState : PrivateState){
    return this
  }

  async onInput(ctx : MonkeyContext){
    return this
  }
}

export default PrivateBlankoState
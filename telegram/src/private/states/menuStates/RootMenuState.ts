import { Context } from 'grammy'
import PrivateState from '../../../interfaces/State'
import { PrivateRoutes } from "../../../interfaces/PrivateState"
import { MonkeyContext } from '../../../interfaces/MonkeyContext'
import { rootMenu } from '../../menu/rootMenu'

class RootMenuState implements PrivateState {
  route : PrivateRoutes

  constructor(){
    this.route = 'root-menu'
  }

  async onEnter(ctx : MonkeyContext, prevState : PrivateState){ 
    
    return this
  }

  async onExit(ctx : MonkeyContext, nextState : PrivateState){
    return this
  }

  async onInput(ctx : MonkeyContext){

    ctx.session.privateContext.clearMsgs(ctx)
    
    return this
  }
}

export default RootMenuState
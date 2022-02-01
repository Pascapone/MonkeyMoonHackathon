import { Context } from "grammy";
import State from "./State";

export type PrivateRoutes = 'initial' | 'root-menu' | 'wallet-menu' | 'input' | 'blanko' | 'decision' |'admin' | 'invite-menu' | 'ico-menu'

interface PrivateState extends State {
  route : PrivateRoutes
}

export default PrivateState
import State from "./State"
import { Context, SessionFlavor } from "grammy";
import PrivateState from "./PrivateState";
import MonkeyStateMachine from "../MonkeyStateMachine";
import { Buttons } from "../private/menu/buttons";
import { MenuFlavor } from "@grammyjs/menu";

export type MenuRoutes = 'root-menu' | 'wallet-menu' | 'invite-menu' | 'ico-menu'

export type MonkeyContext = CustomContext & SessionFlavor<SessionData> & MenuFlavor;

export interface CustomContext extends Context {
}

export interface PrivateContext {
  stateMachine : MonkeyStateMachine
  messageSceneId : number | undefined
  messageSceneFileId : string | undefined
  messageMenuId : number | undefined
  msgIds : Array<number>
  clearMsgs : Function
  clickedButton : Buttons
  clearMenu : Function
  currentMenuRoute : MenuRoutes
}

export interface PublicContext {
  
}

export interface SessionData {
  publicState: "idle" | "welcome";
  privateContext : PrivateContext
}
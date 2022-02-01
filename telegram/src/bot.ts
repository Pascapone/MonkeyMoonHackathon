import { Bot, Context, Keyboard, session, SessionFlavor } from "grammy";
import { Router } from "@grammyjs/router";
import { privateRouter } from "./private/privateRoute";
import { rootMenu } from "./private/menu/rootMenu";
import InitialPrivateState from "./private/states/InitialPrivateState";
import RootMenuState from "./private/states/menuStates/RootMenuState";
import State from "./interfaces/State";
import { SessionData, PrivateContext } from "./interfaces/MonkeyContext";
import { MonkeyContext } from "./interfaces/MonkeyContext";
import MonkeyStateMachine from "./MonkeyStateMachine";
import { registerMenus } from "./private/menu/rootMenu";
import { removeLinkDecision } from "./private/states/decisionStates/RemoveWalletState";
import { OrangoutangStickers } from './interfaces/Stickers'
import dotenv from 'dotenv'
import { connectMoralis } from './database/database'
import { registerPublicRoute} from './public/publicRoute'

dotenv.config()

if(process.env.TELEGRAM_MORALIS_API_KEY){
  const bot = new Bot<MonkeyContext>(process.env.TELEGRAM_MORALIS_API_KEY);

  connectMoralis()

  // Use session.
  bot.use(session({ initial: (): SessionData => ({ 
    publicState: "idle", 
    privateContext : {
      stateMachine :  new MonkeyStateMachine(new InitialPrivateState()),
      messageSceneId : undefined,
      messageSceneFileId : undefined,
      messageMenuId : undefined,
      msgIds : [],
      clearMsgs : function(ctx : MonkeyContext) {
        this.msgIds.forEach((msgId) => {
          if(ctx.chat) ctx.api.deleteMessage(ctx.chat?.id, msgId)
        })
        this.msgIds = []
      },
      clickedButton : undefined,
      clearMenu : async function (ctx : MonkeyContext) {
        if(ctx.chat && this.messageMenuId)
          await ctx.api.deleteMessage(ctx.chat?.id, this.messageMenuId)
          this.messageMenuId = undefined
        if(ctx.chat && this.messageSceneId)
          await ctx.api.deleteMessage(ctx.chat?.id, this.messageSceneId)
          this.messageSceneId = undefined
      },
      currentMenuRoute : 'root-menu',
    }
  }) 
  }));

  // Menus
  registerMenus()
  bot.use(rootMenu)
  bot.use(removeLinkDecision)

  // Define some commands.
  bot.command("start", async (ctx, next) => {
    if(ctx.chat.type === 'private'){
      ctx.session.privateContext.stateMachine = new MonkeyStateMachine(new InitialPrivateState())  
      await ctx.session.privateContext.stateMachine.onInput(ctx)    
      await next()
    }
    else{    
      await ctx.reply(`Welcome!
  We start the session!`);   
    }  
  });


  bot.use(privateRouter); // register private router
  registerPublicRoute(bot) // public router

  // Run
  bot.start();
}


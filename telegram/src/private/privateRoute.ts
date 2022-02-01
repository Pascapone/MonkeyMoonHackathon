import { Router } from "@grammyjs/router";
import { createTelegramUser } from "../database/database";
import { MonkeyContext } from "../interfaces/MonkeyContext";
import FileIdState from "./states/inputStates/FileIdState";


async function inputCatcher(
  ctx: MonkeyContext,
): Promise<void> {
  console.log("Input Catcher")
  if(!ctx.menu && ctx.session.privateContext.stateMachine.currentState.route !== 'input' && ctx.from?.id !== ctx.me.id){
    
    console.log("Delete Message")
    await ctx.deleteMessage()
  }
}

const router = new Router<MonkeyContext>(async (ctx : MonkeyContext) => {
  if(ctx.chat?.type === 'private'){
    console.log("Route Called")

    await inputCatcher(ctx)
    return ctx.session.privateContext.stateMachine.currentState.route
  }  
}); 

// Root Menu
router.route("root-menu", async (ctx, next) => {   
  console.log("ROOT STATE")
  ctx.session.privateContext.stateMachine.onInput(ctx) 
  next()
});

// Wallet Menu
router.route("wallet-menu", async (ctx) => {   
  ctx.session.privateContext.stateMachine.onInput(ctx)
});

// Wallet Menu
router.route("invite-menu", async (ctx) => {   
  ctx.session.privateContext.stateMachine.onInput(ctx)
});

// Wallet Menu
router.route("input", async (ctx) => {   
  ctx.session.privateContext.stateMachine.onInput(ctx)
});

router.route("decision", async (ctx) => {   
  ctx.session.privateContext.stateMachine.onInput(ctx)
});


router.route("root-menu", async (ctx) => {   
  if(ctx.from?.id === Number(process.env.OWNER_ID)){
    console.log("Admin Mode")  
    switch (ctx.msg?.text) {
      case '/registeradmin':
        createTelegramUser(ctx.from.id, ctx.from.username, ctx.from.first_name, undefined)
        ctx.reply("Admin created")
        break;    
      case '/fileid':
        console.log("FILE ID")
        ctx.session.privateContext.stateMachine.switchState(ctx, new FileIdState())
      default:
        break;
    }
  }
});

router.otherwise((ctx, next) => {  
  console.log("private route skip")
  next()
})

export const privateRouter = router
import { Router } from "@grammyjs/router";
import { MonkeyContext } from "../interfaces/MonkeyContext";
import { Bot, Context, Keyboard, session, SessionFlavor } from "grammy";
import { OrangoutangStickers } from "../interfaces/Stickers";
import { createTelegramUser, getTelegramUserById, giveRewardToRecruiter } from "../database/database";


export const registerPublicRoute = (bot : Bot<MonkeyContext>) => {
  bot.use((ctx, next) => {
    next()
  })
  
  bot.command('tokenaddress', (ctx) => {
    ctx.reply('The monkey moon tokenaddress:\n0x1AA60303c4f5926465364A13A125FC574a83f795')
  })

  bot.command('chatid', (ctx) => {
    console.log(ctx.chat.id)
  })

  bot.on('chat_member', async (ctx) => {   
    const newUser = ctx.update.chat_member.new_chat_member.user
    const telegramUser = await getTelegramUserById(newUser.id)

    if(ctx.update.chat_member.new_chat_member.status !== "member") return

    if(telegramUser){
      ctx.reply(`Where have you been monkeying around?\nWelcome back ${newUser.username ?? newUser.first_name}!`)     
    }
    else{    
      const inviteLink = ctx.update.chat_member.invite_link
      const from = ctx.update.chat_member.from
            
      if(inviteLink){
        let recruiter
        try {
          recruiter = await getTelegramUserById(Number(inviteLink.name))          
          if(recruiter){
            recruiter.increment('inviteLinkRecruits')
            giveRewardToRecruiter(recruiter.get("telegramId"), false)
            recruiter.save()
            ctx.reply(`Welcome to the club ${newUser.username ?? newUser.first_name}!\n<i>Recruited by ${recruiter?.get('username') ?? recruiter?.get('firstName')}</i>`, {parse_mode : 'HTML'})
          }else{
            ctx.reply(`Welcome to the club ${newUser.username ?? newUser.first_name}!`)
          }          
        } catch (error) {
          ctx.reply(`Welcome to the club ${newUser.username ?? newUser.first_name}!`)
          console.log(error)
        }
        
        await createTelegramUser(newUser.id, newUser?.username, newUser.first_name, recruiter)
      }
      else if(from){
        let recruiter
        try {
          recruiter = await getTelegramUserById(Number(from.id)) 
          if(recruiter){                     
            recruiter.increment('personalInviteRecruits')                        
            recruiter.save()

            giveRewardToRecruiter(recruiter.get("telegramId"), true)

            ctx.reply(`Welcome to the club ${newUser.username ?? newUser.first_name}!\n<i>Recruited by ${recruiter?.get('username') ?? recruiter?.get('firstName')}</i>`, {parse_mode : 'HTML'})
          }else{
            ctx.reply(`Welcome to the club ${newUser.username ?? newUser.first_name}!`)
          }
          
        } catch (error) {
          ctx.reply(`Welcome to the club ${newUser.username ?? newUser.first_name}!`)
          console.log(error)
        }        
        await createTelegramUser(newUser.id, newUser?.username, newUser.first_name, recruiter)
      }else{
        ctx.reply(`Welcome to the club ${newUser.username ?? newUser.first_name}?\n`)
        await createTelegramUser(newUser.id, newUser?.username, newUser.first_name, undefined)
      }
    }
  })
 
  bot.on(':new_chat_members', async (ctx) => {
    if(ctx.chat.id !== Number(process.env.GROUP_CHAT_ID)){
      await ctx.replyWithAnimation(OrangoutangStickers.nono)
      await ctx.reply("You are not the monkey's owner!")
      ctx.leaveChat()
    }
  })

    
}



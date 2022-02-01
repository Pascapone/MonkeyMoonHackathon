import { Context, NextFunction } from "grammy";
import { MonkeyContext } from "../../interfaces/MonkeyContext";

export type Buttons = undefined | 'link-wallet' | 'remove-link' | 'get-invite-link' | 'get-invite-info' | 'get-wallet-confimation-status' | 'whitelist' | 'get-ico-info'

export async function buttonClicked(
  ctx: MonkeyContext,
  next: NextFunction,
  button : Buttons 
): Promise<void> {
  console.log("Button Clicked")
  ctx.session.privateContext.clearMsgs(ctx)
  ctx.session.privateContext.clickedButton = button
  await next()
}
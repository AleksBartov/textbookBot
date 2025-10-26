import { ADMIN_IDS } from "../config/constants.js";

export function initSession(ctx, next) {
  if (!ctx.session.passedTests) {
    ctx.session.passedTests = [];
  }
  if (ctx.session.currentBlock === undefined) {
    ctx.session.currentBlock = 0;
  }
  return next();
}

export function checkAdmin(ctx, next) {
  ctx.isAdmin = ADMIN_IDS.includes(ctx.from.id);
  return next();
}

export function errorHandler(ctx, next) {
  return next().catch((error) => {
    console.error("Error:", error);
    ctx.reply("❌ Произошла ошибка. Попробуйте позже.");
  });
}

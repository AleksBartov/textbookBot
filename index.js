import { Telegraf, session } from "telegraf";
import { BOT_TOKEN, NAVIGATION_COMMANDS } from "./config/constants.js";
import { initSession, checkAdmin, errorHandler } from "./middleware/index.js";
import { handleStart, handleNext, handleBack } from "./handlers/navigation.js";
import { handleTestAnswer } from "./handlers/tests.js";
import {
  handleAdminList,
  handleAdminAddContent,
  handleAdminAddTest,
  handleAdminEdit,
} from "./handlers/admin.js";

console.log(
  "🚀 Бот запущен в режиме:",
  process.argv.includes("--watch") ? "development" : "production"
);

const bot = new Telegraf(BOT_TOKEN);

// ==================== MIDDLEWARE ====================
bot.use(session());
bot.use(initSession);
bot.use(checkAdmin);
bot.use(errorHandler);

// ==================== АДМИН-КОМАНДЫ ====================
bot.command("admin_list", handleAdminList);
bot.command("admin_add_content", handleAdminAddContent);
bot.command("admin_add_test", handleAdminAddTest);
bot.command("admin_edit", handleAdminEdit);

// ==================== ОСНОВНЫЕ КОМАНДЫ ====================
bot.command("start", handleStart);
bot.hears("Дальше ▶️", handleNext);
bot.hears("◀️ Назад", handleBack);

// ==================== ОБРАБОТКА ТЕСТОВ ====================
bot.on("text", (ctx) => {
  const text = ctx.message.text;

  if (NAVIGATION_COMMANDS.has(text) || text.startsWith("/")) {
    return;
  }

  handleTestAnswer(ctx);
});

// ==================== ЗАПУСК БОТА ====================
bot
  .launch()
  .then(() => {
    console.log("✅ Бот успешно запущен!");
  })
  .catch((error) => {
    console.error("❌ Ошибка запуска бота:", error);
    process.exit(1);
  });

// ==================== GRACEFUL SHUTDOWN ====================
process.once("SIGINT", () => {
  console.log("🛑 Остановка бота...");
  bot.stop("SIGINT");
});

process.once("SIGTERM", () => {
  console.log("🛑 Остановка бота...");
  bot.stop("SIGTERM");
});

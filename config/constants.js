export const BOT_TOKEN = process.env.BOT_TOKEN;
export const ADMIN_IDS = process.env.ADMIN_IDS.split(",").map((id) =>
  parseInt(id.trim())
);

export const NAVIGATION_COMMANDS = new Set(["/start", "Дальше ▶️", "◀️ Назад"]);

if (!BOT_TOKEN) {
  console.error("❌ BOT_TOKEN не найден в .env файле");
  process.exit(1);
}

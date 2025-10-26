import {
  getMaxBlockId,
  updateBlockKeyboard,
  insertBlock,
  insertTest,
  updateBlockText,
  checkBlockExists,
  getAllBlocks,
} from "../utils/blocks.js";

export function handleAdminList(ctx) {
  if (!ctx.isAdmin) {
    return ctx.reply("❌ Доступ запрещен");
  }

  const rows = getAllBlocks();
  if (rows.length === 0) {
    return ctx.reply("📭 Блоков нет. Используйте /admin_add_first");
  }

  let message = "📋 Список блоков:\n\n";
  rows.forEach((block) => {
    const typeIcon = block.type === "test" ? "🧪" : "📄";
    message += `${typeIcon} ${block.id}: ${block.text.substring(0, 30)}... [${
      block.keyboard_type
    }]\n`;
  });

  ctx.reply(message);
}

export function handleAdminAddFirst(ctx) {
  if (!ctx.isAdmin) {
    return ctx.reply("❌ Доступ запрещен");
  }

  const existing = checkBlockExists(0);
  if (existing) {
    return ctx.reply("❌ Первый блок уже существует!");
  }

  insertBlock(0, "content", "Привет друг! Начнем путешествие?", "first");
  ctx.reply("✅ Первый блок добавлен!");
}

export function handleAdminAddContent(ctx) {
  if (!ctx.isAdmin) {
    return ctx.reply("❌ Доступ запрещен");
  }

  const row = getMaxBlockId();
  const newId = row.maxId !== null ? row.maxId + 1 : 0;
  const text = `Это блок знаний ${newId + 1}`;

  if (row.maxId !== null) {
    updateBlockKeyboard(row.maxId);
  }

  const keyboardType = newId === 0 ? "first" : "last";
  insertBlock(newId, "content", text, keyboardType);
  ctx.reply(`✅ Добавлен контент-блок ${newId}!`);
}

export function handleAdminAddTest(ctx) {
  if (!ctx.isAdmin) {
    return ctx.reply("❌ Доступ запрещен");
  }

  const args = ctx.message.text.split("|").map((arg) => arg.trim());
  if (args.length < 4) {
    return ctx.reply(
      "Использование: /admin_add_test вопрос | правильный ответ | вариант1 | вариант2 | вариант3 ..."
    );
  }

  const [question, correctAnswer, ...options] = args.slice(1);

  if (!options.includes(correctAnswer)) {
    return ctx.reply("❌ Правильный ответ должен быть среди вариантов!");
  }

  const row = getMaxBlockId();
  const newId = row.maxId !== null ? row.maxId + 1 : 0;

  if (row.maxId !== null) {
    updateBlockKeyboard(row.maxId);
  }

  insertBlock(newId, "test", `Тест: ${question.substring(0, 50)}...`, "last");
  insertTest(newId, question, correctAnswer, JSON.stringify(options));

  ctx.reply(`✅ Добавлен тест-блок ${newId}!`);
}

export function handleAdminEdit(ctx) {
  if (!ctx.isAdmin) {
    return ctx.reply("❌ Доступ запрещен");
  }

  const args = ctx.message.text.split(" ").slice(1);
  if (args.length < 2) {
    return ctx.reply("Использование: /admin_edit [id] [текст]");
  }

  const blockId = parseInt(args[0]);
  const text = args.slice(1).join(" ");

  const existing = checkBlockExists(blockId);
  if (!existing) {
    return ctx.reply("❌ Блок не найден");
  }

  updateBlockText(blockId, text);
  ctx.reply(`✅ Блок ${blockId} обновлен!`);
}

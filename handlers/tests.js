import { getBlock, getAdjacentBlocks } from "../utils/blocks.js";
import { createKeyboard } from "../utils/keyboard.js";
import { hasUserPassedTest } from "../utils/progress.js";
import { getTest } from "../utils/blocks.js";

export async function showBlock(ctx, blockId) {
  try {
    const block = getBlock(blockId);
    if (!block) {
      await ctx.reply("Блок не найден.");
      return;
    }

    ctx.session.currentBlock = blockId;

    if (
      block.type === "test" &&
      !hasUserPassedTest(ctx.from.id, blockId, ctx.session)
    ) {
      const test = getTest(blockId);
      if (!test) {
        await ctx.reply("❌ Ошибка: тест не найден");
        return;
      }

      const message = `📝 Тест:\n${test.question}\n\nВыберите правильный ответ:`;
      await ctx.reply(message, createKeyboard(block, ctx.from.id, blockId));
      return;
    }

    await ctx.reply(block.text, createKeyboard(block, ctx.from.id, blockId));
  } catch (error) {
    console.error("Error in showBlock:", error);
    await ctx.reply("❌ Произошла ошибка при загрузке блока.");
  }
}

export function handleStart(ctx) {
  ctx.session.currentBlock = 0;
  showBlock(ctx, 0);
}

export function handleNext(ctx) {
  ctx.deleteMessage().catch(() => {});
  const adjacent = getAdjacentBlocks(ctx.session.currentBlock);
  if (adjacent.next !== null) {
    showBlock(ctx, adjacent.next);
  }
}

export function handleBack(ctx) {
  ctx.deleteMessage().catch(() => {});
  const adjacent = getAdjacentBlocks(ctx.session.currentBlock);
  if (adjacent.prev !== null) {
    showBlock(ctx, adjacent.prev);
  }
}

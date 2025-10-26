import { getBlock, getTest, getAdjacentBlocks } from "../utils/blocks.js";
import { markTestPassed } from "../utils/progress.js";
import { showBlock } from "./navigation.js";

export async function handleTestAnswer(ctx) {
  const currentBlockId = ctx.session.currentBlock;
  const currentBlock = getBlock(currentBlockId);

  if (!currentBlock || currentBlock.type !== "test") {
    return;
  }

  const test = getTest(currentBlockId);
  const userAnswer = ctx.message.text;

  if (!test) {
    await ctx.reply("❌ Ошибка: тест не найден");
    return;
  }

  if (userAnswer === test.correct_answer) {
    markTestPassed(ctx.from.id, currentBlockId, ctx.session);

    await ctx.deleteMessage().catch(() => {});
    await ctx.reply("✅ Правильно! Молодец!");

    const adjacent = getAdjacentBlocks(currentBlockId);
    if (adjacent.next !== null) {
      setTimeout(() => showBlock(ctx, adjacent.next), 1000);
    }
  } else {
    await ctx.reply("❌ Неправильно. Попробуй еще раз!");
  }
}

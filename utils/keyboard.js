import { Markup } from "telegraf";
import { hasUserPassedTest } from "./progress.js";
import { stmt } from "../config/database.js";

export function createKeyboard(block, userId, blockId) {
  if (block.type === "test" && !hasUserPassedTest(userId, blockId)) {
    const test = stmt.getTest.get(blockId);
    if (!test) return Markup.removeKeyboard();

    const options = JSON.parse(test.options);
    const buttons = options.map((opt) => [opt]);
    buttons.push(["◀️ Назад"]);
    return Markup.keyboard(buttons).resize();
  }

  switch (block.keyboard_type) {
    case "first":
      return Markup.keyboard([["Дальше ▶️"]]).resize();
    case "last":
      return Markup.keyboard([["◀️ Назад"]]).resize();
    default:
      return Markup.keyboard([["◀️ Назад", "Дальше ▶️"]]).resize();
  }
}

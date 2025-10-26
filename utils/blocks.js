import { stmt } from "../config/database.js";

export function getBlock(blockId) {
  return stmt.getBlock.get(blockId);
}

export function getTest(blockId) {
  return stmt.getTest.get(blockId);
}

export function getAdjacentBlocks(currentBlockId) {
  return stmt.getAdjacentBlocks.get(currentBlockId, currentBlockId);
}

export function getMaxBlockId() {
  return stmt.getMaxBlockId.get();
}

export function updateBlockKeyboard(blockId) {
  stmt.updateBlockKeyboard.run(blockId);
}

export function insertBlock(id, type, text, keyboardType) {
  stmt.insertBlock.run(id, type, text, keyboardType);
}

export function insertTest(blockId, question, correctAnswer, options) {
  stmt.insertTest.run(
    blockId,
    question,
    correctAnswer,
    JSON.stringify(options)
  );
}

export function updateBlockText(blockId, text) {
  stmt.updateBlockText.run(text, blockId);
}

export function checkBlockExists(blockId) {
  return stmt.checkBlockExists.get(blockId);
}

export function getAllBlocks() {
  return stmt.getAllBlocks.all();
}

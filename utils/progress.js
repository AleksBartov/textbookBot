import { stmt } from "../config/database.js";

export function hasUserPassedTest(userId, blockId, session = null) {
  if (session?.passedTests?.includes(blockId)) {
    return true;
  }

  const result = stmt.getUserProgress.get(userId, blockId);
  const passed = result ? result.passed : false;

  if (passed && session) {
    if (!session.passedTests) session.passedTests = [];
    session.passedTests.push(blockId);
  }

  return passed;
}

export function markTestPassed(userId, blockId, session = null) {
  stmt.markTestPassed.run(userId, blockId);

  if (session) {
    if (!session.passedTests) session.passedTests = [];
    if (!session.passedTests.includes(blockId)) {
      session.passedTests.push(blockId);
    }
  }
}

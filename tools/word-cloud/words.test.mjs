import test from "node:test";
import assert from "node:assert/strict";
import { countWords, MAX_WORDS } from "./words.mjs";

test("counts case-insensitively and parses editable stop words", () => {
  assert.deepEqual(countWords("The CLOUD cloud, sky! And the rain.", "THE,\nand"), {
    words: [{ text: "cloud", count: 2 }, { text: "rain", count: 1 }, { text: "sky", count: 1 }],
    uniqueCount: 3,
  });
  assert.equal(countWords("the the", "").words[0].count, 2);
  assert.equal(countWords("the the", "the").words.length, 0);
});

test("normalizes Unicode and apostrophes without treating numbers as words", () => {
  assert.deepEqual(countWords("CAFÉ cafe\u0301 ＣＡＦÉ don't don’t 123 a I", "DON’T").words, [
    { text: "café", count: 3 },
  ]);
  assert.deepEqual(countWords("你好 世界 你好", "").words, [
    { text: "你好", count: 2 }, { text: "世界", count: 1 },
  ]);
});

test("handles empty content and reports the number before the word limit", () => {
  assert.deepEqual(countWords("123 !", ""), { words: [], uniqueCount: 0 });
  const content = Array.from({ length: MAX_WORDS + 5 }, (_, index) =>
    `word${String.fromCharCode(97 + Math.floor(index / 26))}${String.fromCharCode(97 + index % 26)}`).join(" ");
  const result = countWords(`${content} priority priority`, "");
  assert.equal(result.uniqueCount, MAX_WORDS + 6);
  assert.equal(result.words.length, MAX_WORDS);
  assert.deepEqual(result.words[0], { text: "priority", count: 2 });
});

import { describe, expect, it } from "vitest";
import type { ArticleBlock } from "../types";
import { applyLearnedTypes, learnBlockType } from "./recognitionLearning";

const paragraphBlock: ArticleBlock = {
  id: "1-paragraph-demo",
  type: "paragraph",
  content: "最简单的目录结构："
};

describe("recognitionLearning", () => {
  it("记住手动调整并在后续相同内容上自动套用类型", () => {
    const rules = learnBlockType([], paragraphBlock, "subheading", 1000);
    const nextBlocks = applyLearnedTypes([{ ...paragraphBlock, id: "2-paragraph-demo" }], rules);

    expect(nextBlocks[0].type).toBe("subheading");
  });

  it("重复学习同一内容会增加使用次数并保留最新类型", () => {
    const first = learnBlockType([], paragraphBlock, "subheading", 1000);
    const second = learnBlockType(first, paragraphBlock, "emphasis", 2000);

    expect(second).toHaveLength(1);
    expect(second[0]).toMatchObject({
      type: "emphasis",
      uses: 2,
      updatedAt: 2000
    });
  });
});

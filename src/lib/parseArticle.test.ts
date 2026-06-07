import { describe, expect, it } from "vitest";
import { parseArticle } from "./parseArticle";

describe("parseArticle", () => {
  it("识别标题、引用、列表、重点句和分割线", () => {
    const blocks = parseArticle(`# 主标题

> 这是一段引用

- 第一项
- 第二项

**重点：这里需要突出**

---

正文段落`);

    expect(blocks.map((block) => block.type)).toEqual([
      "heading",
      "quote",
      "list",
      "emphasis",
      "divider",
      "paragraph"
    ]);
    expect(blocks[2].items).toEqual(["第一项", "第二项"]);
  });

  it("识别中文序号短句为二级标题", () => {
    const blocks = parseArticle(`一、先明确目标

正文内容`);

    expect(blocks[0].type).toBe("heading");
    expect(blocks[1].type).toBe("paragraph");
  });

  it("将无Markdown标记的第一行短文本识别为一级标题", () => {
    const blocks = parseArticle(`运营效率提升指南

这是一段正文。`);

    expect(blocks[0].type).toBe("heading");
    expect(blocks[1].type).toBe("paragraph");
  });
});

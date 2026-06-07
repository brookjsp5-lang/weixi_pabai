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

  it("识别Markdown表格、代码块和图片", () => {
    const blocks = parseArticle(`| 层级 | 路径 | 适合 |
| --- | --- | --- |
| 当前仓库 | <项目根>/.agents/skills/ | 团队共享 |
| 当前目录 | $CWD/.agents/skills/ | 临时用 |

\`\`\`
.agents/
└── skills/
    └── weekly-report/
\`\`\`

![目录结构](https://example.com/tree.png)`);

    expect(blocks.map((block) => block.type)).toEqual(["table", "code", "image"]);
    expect(blocks[0].rows).toEqual([
      ["当前仓库", "<项目根>/.agents/skills/", "团队共享"],
      ["当前目录", "$CWD/.agents/skills/", "临时用"]
    ]);
    expect(blocks[1].content).toContain(".agents/");
    expect(blocks[2].src).toBe("https://example.com/tree.png");
    expect(blocks[2].alt).toBe("目录结构");
  });
});

import { describe, expect, it } from "vitest";
import type { ArticleBlock } from "../types";
import { renderWechatHtml } from "./renderWechatHtml";
import { templates } from "./templates";

const blocks: ArticleBlock[] = [
  { id: "1", type: "heading", content: "主标题" },
  { id: "2", type: "paragraph", content: "正文内容" },
  { id: "3", type: "quote", content: "引用内容" },
  { id: "4", type: "list", content: "第一项\n第二项", items: ["第一项", "第二项"] },
  { id: "5", type: "divider", content: "" },
  { id: "6", type: "emphasis", content: "重点内容" }
];

describe("renderWechatHtml", () => {
  it("10套模板都生成微信可复制的内联样式HTML", () => {
    expect(templates).toHaveLength(10);

    for (const template of templates) {
      const html = renderWechatHtml(blocks, template);
      expect(html).toContain("<section style=");
      expect(html).toContain("<h1 style=");
      expect(html).toContain("<p style=");
      expect(html).toContain("<ul style=");
      expect(html).toContain("<li style=");
      expect(html).toContain("<hr style=");
      expect(html).toContain(template.accent);
    }
  });

  it("段落类型手动改为引用后使用引用样式渲染", () => {
    const [paragraph] = blocks.filter((block) => block.type === "paragraph");
    const html = renderWechatHtml([{ ...paragraph, type: "quote" }], templates[0]);

    expect(html).toContain("border-left");
    expect(html).toContain("正文内容");
  });
});

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
  { id: "6", type: "emphasis", content: "重点内容" },
  {
    id: "7",
    type: "table",
    content: "层级 | 路径 | 适合",
    headers: ["层级", "路径", "适合"],
    rows: [["当前仓库", "<项目根>/.agents/skills/", "团队共享"]]
  },
  { id: "8", type: "code", content: ".agents/\n└── skills/" },
  { id: "9", type: "image", content: "目录结构", src: "https://example.com/tree.png", alt: "目录结构" }
];

describe("renderWechatHtml", () => {
  it("所有模板都生成微信可复制的内联样式HTML", () => {
    expect(templates).toHaveLength(11);

    for (const template of templates) {
      const html = renderWechatHtml(blocks, template);
      expect(html).toContain("<section style=");
      expect(html).toContain("<h1 style=");
      expect(html).toContain("<p style=");
      expect(html).toContain("<ul style=");
      expect(html).toContain("<li style=");
      expect(html).toContain("<hr style=");
      expect(html).toContain("<table");
      expect(html).toContain("<pre");
      expect(html).toContain("<img");
      expect(html).toContain(template.accent);
    }
  });

  it("段落类型手动改为引用后使用引用样式渲染", () => {
    const [paragraph] = blocks.filter((block) => block.type === "paragraph");
    const html = renderWechatHtml([{ ...paragraph, type: "quote" }], templates[0]);

    expect(html).toContain("border-left");
    expect(html).toContain("正文内容");
  });

  it("蓝紫教程模板保留目标文章的教程排版特征", () => {
    const template = templates.find((item) => item.id === "blue-purple-tutorial");
    expect(template).toBeDefined();

    const html = renderWechatHtml(blocks, template!);
    expect(html).toContain("linear-gradient(90deg,#002fa7,#7268d5)");
    expect(html).toContain("Noto Serif SC");
    expect(html).toContain("letter-spacing:0.1em");
    expect(html).toContain("rgba(0,47,167,0.08)");
  });

  it("表格、代码块、图片使用微信兼容内联样式渲染", () => {
    const html = renderWechatHtml(blocks.slice(6), templates[0]);

    expect(html).toContain("<table style=");
    expect(html).toContain("<th style=");
    expect(html).toContain("&lt;项目根&gt;/.agents/skills/");
    expect(html).toContain("<pre style=");
    expect(html).toContain("white-space:pre-wrap");
    expect(html).toContain('<img src="https://example.com/tree.png"');
    expect(html).toContain('alt="目录结构"');
  });
});

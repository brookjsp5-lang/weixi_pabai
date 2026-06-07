import { describe, expect, it } from "vitest";
import { convertClipboardHtmlToMarkdown } from "./clipboardImport";
import { parseArticle } from "./parseArticle";

describe("convertClipboardHtmlToMarkdown", () => {
  it("将富文本表格、代码块和图片转换为可自动识别的初稿文本", () => {
    const markdown = convertClipboardHtmlToMarkdown(`
      <article>
        <p>最简单的目录结构：</p>
        <table>
          <tr><th>层级</th><th>路径</th><th>适合</th></tr>
          <tr><td>当前仓库</td><td>&lt;项目根&gt;/.agents/skills/</td><td>团队共享</td></tr>
        </table>
        <pre><code>.agents/
└── skills/
    └── weekly-report/</code></pre>
        <img src="https://example.com/tree.png" alt="目录结构">
      </article>
    `);

    expect(markdown).toContain("| 层级 | 路径 | 适合 |");
    expect(markdown).toContain("| --- | --- | --- |");
    expect(markdown).toContain("```");
    expect(markdown).toContain("![目录结构](https://example.com/tree.png)");

    expect(parseArticle(markdown).map((block) => block.type)).toEqual(["heading", "table", "code", "image"]);
  });
});

import type { ArticleBlock, StyleTemplate } from "../types";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderBlock(block: ArticleBlock, template: StyleTemplate) {
  const style = template.blockStyles[block.type];

  if (block.type === "divider") {
    return `<hr style="${style}" />`;
  }

  if (block.type === "list") {
    const items = block.items?.length ? block.items : block.content.split("\n");
    return `<ul style="${style}">${items
      .map((item) => `<li style="${template.listItemStyle}">${escapeHtml(item)}</li>`)
      .join("")}</ul>`;
  }

  if (block.type === "table") {
    const headers = block.headers ?? [];
    const rows = block.rows ?? [];
    return `<table style="${style}"><thead><tr>${headers
      .map((header) => `<th style="${template.tableHeaderStyle}">${escapeHtml(header)}</th>`)
      .join("")}</tr></thead><tbody>${rows
      .map(
        (row) =>
          `<tr>${row.map((cell) => `<td style="${template.tableCellStyle}">${escapeHtml(cell)}</td>`).join("")}</tr>`
      )
      .join("")}</tbody></table>`;
  }

  if (block.type === "code") {
    return `<pre style="${template.codeStyle}"><code>${escapeHtml(block.content)}</code></pre>`;
  }

  if (block.type === "image") {
    const src = escapeHtml(block.src ?? block.content);
    const alt = escapeHtml(block.alt ?? block.content);
    return `<p style="${style}"><img src="${src}" alt="${alt}" style="${template.imageStyle}" /></p>`;
  }

  const tag = block.type === "heading" ? "h1" : block.type === "subheading" ? "h2" : "p";
  return `<${tag} style="${style}">${escapeHtml(block.content).replace(/\n/g, "<br />")}</${tag}>`;
}

export function renderWechatHtml(blocks: ArticleBlock[], template: StyleTemplate) {
  return `<section style="${template.containerStyle}">${blocks
    .map((block) => renderBlock(block, template))
    .join("")}</section>`;
}

export function blocksToPlainText(blocks: ArticleBlock[]) {
  return blocks
    .map((block) => {
      if (block.type === "divider") return "------";
      if (block.type === "list") return (block.items ?? []).map((item) => `- ${item}`).join("\n");
      if (block.type === "table") {
        const headers = block.headers?.join("\t") ?? "";
        const rows = block.rows?.map((row) => row.join("\t")).join("\n") ?? "";
        return [headers, rows].filter(Boolean).join("\n");
      }
      if (block.type === "image") return block.src ?? block.content;
      return block.content;
    })
    .filter(Boolean)
    .join("\n\n");
}

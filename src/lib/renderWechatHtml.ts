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
      return block.content;
    })
    .filter(Boolean)
    .join("\n\n");
}

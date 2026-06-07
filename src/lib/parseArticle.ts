import type { ArticleBlock, BlockType } from "../types";

const dividerPattern = /^(\*{3,}|-{3,}|_{3,}|—{2,}|={3,})$/;
const orderedListPattern = /^(\d+)[.)、]\s+(.+)$/;
const unorderedListPattern = /^[-*+]\s+(.+)$/;
const subheadingPattern = /^([一二三四五六七八九十]+[、.．]|第[一二三四五六七八九十\d]+[章节]|[（(]\d+[）)]|0?\d+[、.．])\s*(.+)$/;
const emphasisLeadPattern = /^(重点|金句|提醒|注意|结论|核心|建议|划重点)[:：]/;

function stableId(index: number, type: BlockType, content: string) {
  let hash = 0;
  for (let i = 0; i < content.length; i += 1) {
    hash = (hash * 31 + content.charCodeAt(i)) >>> 0;
  }
  return `${index}-${type}-${hash.toString(36)}`;
}

function stripInlineMarkdown(value: string) {
  return value
    .replace(/^\*\*(.+)\*\*$/, "$1")
    .replace(/^__(.+)__$/, "$1")
    .trim();
}

function classifyLine(rawLine: string): Omit<ArticleBlock, "id"> {
  const line = rawLine.trim();

  if (dividerPattern.test(line)) {
    return { type: "divider", content: "" };
  }

  if (line.startsWith("# ")) {
    return { type: "heading", content: stripInlineMarkdown(line.slice(2)) };
  }

  if (line.startsWith("## ")) {
    return { type: "subheading", content: stripInlineMarkdown(line.slice(3)) };
  }

  if (line.startsWith(">")) {
    return { type: "quote", content: stripInlineMarkdown(line.replace(/^>\s?/, "")) };
  }

  if (/^(\*\*.+\*\*|__.+__)$/.test(line) || emphasisLeadPattern.test(line)) {
    return { type: "emphasis", content: stripInlineMarkdown(line) };
  }

  const subheadingMatch = line.match(subheadingPattern);
  if (subheadingMatch && line.length <= 42) {
    return { type: "subheading", content: stripInlineMarkdown(line) };
  }

  return { type: "paragraph", content: stripInlineMarkdown(line) };
}

function listText(line: string) {
  return (
    line.match(unorderedListPattern)?.[1] ??
    line.match(orderedListPattern)?.[2] ??
    line.trim()
  );
}

function isListLine(line: string) {
  return unorderedListPattern.test(line.trim()) || orderedListPattern.test(line.trim());
}

export function parseArticle(text: string): ArticleBlock[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: ArticleBlock[] = [];
  let index = 0;
  let pendingList: string[] = [];

  const flushList = () => {
    if (pendingList.length === 0) return;
    const content = pendingList.join("\n");
    blocks.push({
      id: stableId(index, "list", content),
      type: "list",
      content,
      items: pendingList
    });
    index += 1;
    pendingList = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      continue;
    }

    if (isListLine(line)) {
      pendingList.push(stripInlineMarkdown(listText(line)));
      continue;
    }

    flushList();
    const classified = classifyLine(line);
    const shouldPromoteFirstLine =
      blocks.length === 0 &&
      (classified.type === "subheading" ||
        (classified.type === "paragraph" &&
          classified.content.length <= 36 &&
          !/[。！？!?；;]/.test(classified.content)));
    const block = shouldPromoteFirstLine ? { ...classified, type: "heading" as const } : classified;
    blocks.push({
      id: stableId(index, block.type, block.content),
      ...block
    });
    index += 1;
  }

  flushList();
  return blocks;
}

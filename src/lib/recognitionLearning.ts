import type { ArticleBlock, BlockType } from "../types";

export interface LearnedBlockRule {
  signature: string;
  type: BlockType;
  sample: string;
  uses: number;
  updatedAt: number;
}

const maxRules = 120;

function normalizeContent(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 160).toLowerCase();
}

function blockSignature(block: ArticleBlock) {
  if (block.type === "image" && block.src) return `image:${block.src}`;
  if (block.type === "table" && block.headers?.length) return `table:${block.headers.join("|")}`;
  return `text:${normalizeContent(block.content)}`;
}

export function learnBlockType(
  rules: LearnedBlockRule[],
  block: ArticleBlock,
  type: BlockType,
  now = Date.now()
): LearnedBlockRule[] {
  const signature = blockSignature(block);
  if (!signature || signature === "text:") return rules;

  const existing = rules.find((rule) => rule.signature === signature);
  const nextRule: LearnedBlockRule = {
    signature,
    type,
    sample: block.content.slice(0, 80),
    uses: existing ? existing.uses + 1 : 1,
    updatedAt: now
  };

  return [nextRule, ...rules.filter((rule) => rule.signature !== signature)]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, maxRules);
}

export function applyLearnedTypes(blocks: ArticleBlock[], rules: LearnedBlockRule[]) {
  const lookup = new Map(rules.map((rule) => [rule.signature, rule.type]));
  return blocks.map((block) => {
    const type = lookup.get(blockSignature(block));
    if (!type || type === block.type) return block;
    return { ...block, type };
  });
}

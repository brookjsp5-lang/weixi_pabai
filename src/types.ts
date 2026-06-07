export type BlockType =
  | "heading"
  | "subheading"
  | "paragraph"
  | "quote"
  | "list"
  | "divider"
  | "emphasis";

export interface ArticleBlock {
  id: string;
  type: BlockType;
  content: string;
  items?: string[];
}

export type BlockStyleRules = Record<BlockType, string>;

export interface StyleTemplate {
  id: string;
  name: string;
  scenario: string;
  accent: string;
  previewBackground: string;
  containerStyle: string;
  blockStyles: BlockStyleRules;
  listItemStyle: string;
}

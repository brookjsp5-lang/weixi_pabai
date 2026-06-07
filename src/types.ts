export type BlockType =
  | "heading"
  | "subheading"
  | "paragraph"
  | "quote"
  | "list"
  | "divider"
  | "emphasis"
  | "table"
  | "code"
  | "image";

export interface ArticleBlock {
  id: string;
  type: BlockType;
  content: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
  src?: string;
  alt?: string;
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
  tableHeaderStyle: string;
  tableCellStyle: string;
  codeStyle: string;
  imageStyle: string;
}

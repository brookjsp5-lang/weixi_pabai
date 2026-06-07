import type { BlockStyleRules, StyleTemplate } from "../types";

function blockStyles(accent: string, text: string, muted: string, surface: string): BlockStyleRules {
  return {
    heading: `margin:0 0 22px;padding:0 0 14px;border-bottom:2px solid ${accent};font-size:24px;line-height:1.35;font-weight:700;color:${text};letter-spacing:0;`,
    subheading: `margin:28px 0 12px;padding:0 0 0 12px;border-left:4px solid ${accent};font-size:18px;line-height:1.45;font-weight:700;color:${text};letter-spacing:0;`,
    paragraph: `margin:14px 0;font-size:16px;line-height:1.9;color:${text};letter-spacing:0;text-align:left;`,
    quote: `margin:18px 0;padding:14px 16px;border-left:4px solid ${accent};background:${surface};font-size:15px;line-height:1.85;color:${muted};`,
    list: `margin:16px 0;padding:0;color:${text};`,
    divider: `margin:28px auto;border:0;border-top:1px solid ${accent};width:64px;height:1px;`,
    emphasis: `margin:18px 0;padding:13px 15px;background:${surface};border:1px solid ${accent};font-size:16px;line-height:1.8;font-weight:700;color:${text};`
  };
}

const baseContainer = "box-sizing:border-box;width:100%;max-width:677px;margin:0 auto;padding:26px 22px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',Arial,sans-serif;";

export const templates: StyleTemplate[] = [
  {
    id: "business-clean",
    name: "商务简洁",
    scenario: "适合企业通知、项目复盘、专业观点",
    accent: "#0f766e",
    previewBackground: "#ffffff",
    containerStyle: `${baseContainer}background:#ffffff;`,
    blockStyles: blockStyles("#0f766e", "#1f2937", "#4b5563", "#ecfdf5"),
    listItemStyle: "margin:8px 0 8px 20px;font-size:16px;line-height:1.85;color:#1f2937;"
  },
  {
    id: "knowledge",
    name: "知识干货",
    scenario: "适合方法论、教程、清单类文章",
    accent: "#2563eb",
    previewBackground: "#f8fbff",
    containerStyle: `${baseContainer}background:#ffffff;`,
    blockStyles: blockStyles("#2563eb", "#172033", "#526071", "#eff6ff"),
    listItemStyle: "margin:8px 0 8px 20px;font-size:16px;line-height:1.85;color:#172033;"
  },
  {
    id: "healing",
    name: "情感治愈",
    scenario: "适合成长感悟、情绪陪伴、生活随笔",
    accent: "#db2777",
    previewBackground: "#fff7fb",
    containerStyle: `${baseContainer}background:#fffefe;`,
    blockStyles: blockStyles("#db2777", "#3f2434", "#75586a", "#fdf2f8"),
    listItemStyle: "margin:8px 0 8px 20px;font-size:16px;line-height:1.9;color:#3f2434;"
  },
  {
    id: "premium-brand",
    name: "品牌高级",
    scenario: "适合品牌故事、产品发布、主理人表达",
    accent: "#111827",
    previewBackground: "#f7f7f5",
    containerStyle: `${baseContainer}background:#ffffff;`,
    blockStyles: blockStyles("#111827", "#111827", "#52525b", "#f4f4f5"),
    listItemStyle: "margin:8px 0 8px 20px;font-size:16px;line-height:1.86;color:#111827;"
  },
  {
    id: "news",
    name: "资讯快报",
    scenario: "适合行业动态、活动报道、新闻摘要",
    accent: "#dc2626",
    previewBackground: "#fffafa",
    containerStyle: `${baseContainer}background:#ffffff;`,
    blockStyles: blockStyles("#dc2626", "#222222", "#5f6368", "#fef2f2"),
    listItemStyle: "margin:7px 0 7px 20px;font-size:16px;line-height:1.82;color:#222222;"
  },
  {
    id: "minimal-mono",
    name: "极简黑白",
    scenario: "适合深度思考、访谈、长文",
    accent: "#111111",
    previewBackground: "#ffffff",
    containerStyle: `${baseContainer}background:#ffffff;`,
    blockStyles: blockStyles("#111111", "#111111", "#555555", "#f6f6f6"),
    listItemStyle: "margin:8px 0 8px 20px;font-size:16px;line-height:1.9;color:#111111;"
  },
  {
    id: "youth",
    name: "活泼年轻",
    scenario: "适合社媒种草、校园、轻内容运营",
    accent: "#f97316",
    previewBackground: "#fff9f1",
    containerStyle: `${baseContainer}background:#ffffff;`,
    blockStyles: blockStyles("#f97316", "#2b2118", "#68513e", "#fff7ed"),
    listItemStyle: "margin:8px 0 8px 20px;font-size:16px;line-height:1.84;color:#2b2118;"
  },
  {
    id: "reading-notes",
    name: "读书笔记",
    scenario: "适合摘录、书评、学习笔记",
    accent: "#7c3aed",
    previewBackground: "#fbfaff",
    containerStyle: `${baseContainer}background:#ffffff;`,
    blockStyles: blockStyles("#7c3aed", "#282033", "#675c72", "#f5f3ff"),
    listItemStyle: "margin:8px 0 8px 20px;font-size:16px;line-height:1.88;color:#282033;"
  },
  {
    id: "course",
    name: "课程推广",
    scenario: "适合训练营、公开课、转化文章",
    accent: "#0891b2",
    previewBackground: "#f1fbfd",
    containerStyle: `${baseContainer}background:#ffffff;`,
    blockStyles: blockStyles("#0891b2", "#16333b", "#526a70", "#ecfeff"),
    listItemStyle: "margin:8px 0 8px 20px;font-size:16px;line-height:1.84;color:#16333b;"
  },
  {
    id: "community",
    name: "社群活动",
    scenario: "适合活动招募、社群公告、复盘总结",
    accent: "#16a34a",
    previewBackground: "#f5fff8",
    containerStyle: `${baseContainer}background:#ffffff;`,
    blockStyles: blockStyles("#16a34a", "#173421", "#52675a", "#f0fdf4"),
    listItemStyle: "margin:8px 0 8px 20px;font-size:16px;line-height:1.84;color:#173421;"
  }
];

export const defaultTemplate = templates[0];

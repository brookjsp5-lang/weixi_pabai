import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { copyRichText } from "./lib/copyRichText";
import { parseArticle } from "./lib/parseArticle";
import { blocksToPlainText, renderWechatHtml } from "./lib/renderWechatHtml";
import { defaultTemplate, templates } from "./lib/templates";
import type { ArticleBlock, BlockType } from "./types";
import "./styles.css";

const storageKeys = {
  draft: "wechat-format-draft",
  template: "wechat-format-template",
  overrides: "wechat-format-overrides"
};

const sampleArticle = `# 公众号排版效率提升指南

当一篇文章进入发布前的最后一步，排版往往最容易消耗时间。

> 好的排版不是装饰，而是帮助读者更快理解内容。

一、先把结构分清楚

- 标题负责建立预期
- 小标题负责分段
- 引用负责突出观点
- 列表负责降低阅读负担

**重点：稳定的样式比复杂的装饰更重要。**

---

排版工具的价值，就是把重复劳动交给系统，把判断力留给运营者。`;

const blockTypeLabels: Record<BlockType, string> = {
  heading: "一级标题",
  subheading: "二级标题",
  paragraph: "正文",
  quote: "引用",
  list: "列表",
  divider: "分割线",
  emphasis: "重点句"
};

function loadOverrides(): Record<string, BlockType> {
  try {
    return JSON.parse(localStorage.getItem(storageKeys.overrides) ?? "{}");
  } catch {
    return {};
  }
}

function applyOverrides(blocks: ArticleBlock[], overrides: Record<string, BlockType>) {
  return blocks.map((block) => {
    const overriddenType = overrides[block.id];
    if (!overriddenType || overriddenType === block.type) return block;
    return {
      ...block,
      type: overriddenType,
      items:
        overriddenType === "list"
          ? block.content
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean)
          : block.items
    };
  });
}

function usePersistentState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    if (stored === null) return fallback;
    try {
      return JSON.parse(stored) as T;
    } catch {
      return stored as T;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

function TypeSelect({
  value,
  onChange
}: {
  value: BlockType;
  onChange: (value: BlockType) => void;
}) {
  return (
    <select className="typeSelect" value={value} onChange={(event) => onChange(event.target.value as BlockType)}>
      {Object.entries(blockTypeLabels).map(([type, label]) => (
        <option key={type} value={type}>
          {label}
        </option>
      ))}
    </select>
  );
}

function App() {
  const [draft, setDraft] = usePersistentState(storageKeys.draft, sampleArticle);
  const [templateId, setTemplateId] = usePersistentState(storageKeys.template, defaultTemplate.id);
  const [overrides, setOverrides] = useState<Record<string, BlockType>>(loadOverrides);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const parsedBlocks = useMemo(() => parseArticle(draft), [draft]);
  const blocks = useMemo(() => applyOverrides(parsedBlocks, overrides), [parsedBlocks, overrides]);
  const selectedTemplate = templates.find((template) => template.id === templateId) ?? defaultTemplate;
  const html = useMemo(() => renderWechatHtml(blocks, selectedTemplate), [blocks, selectedTemplate]);
  const plainText = useMemo(() => blocksToPlainText(blocks), [blocks]);

  useEffect(() => {
    localStorage.setItem(storageKeys.overrides, JSON.stringify(overrides));
  }, [overrides]);

  const updateBlockType = (block: ArticleBlock, type: BlockType) => {
    setOverrides((current) => ({ ...current, [block.id]: type }));
  };

  const handleCopy = async () => {
    try {
      await copyRichText(html, plainText);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 2600);
    }
  };

  return (
    <main className="appShell">
      <header className="topBar">
        <div>
          <h1>微信公众号一键排版</h1>
          <p>粘贴初稿，识别结构，选择模板，复制富文本到公众号后台。</p>
        </div>
        <button className="ghostButton" onClick={() => setDraft(sampleArticle)}>
          恢复示例
        </button>
      </header>

      <section className="workspace">
        <section className="panel inputPanel">
          <div className="panelHeader">
            <div>
              <h2>文章初稿</h2>
              <span>{draft.length} 字</span>
            </div>
          </div>
          <textarea
            className="articleInput"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            spellCheck={false}
            placeholder="在这里粘贴公众号文章初稿，支持 # 标题、> 引用、- 列表、**重点句**。"
          />
        </section>

        <section className="panel structurePanel">
          <div className="panelHeader">
            <div>
              <h2>结构识别</h2>
              <span>{blocks.length} 个内容块</span>
            </div>
            <button className="ghostButton compact" onClick={() => setOverrides({})}>
              重置类型
            </button>
          </div>
          <div className="blockList">
            {blocks.length === 0 ? (
              <div className="emptyState">粘贴内容后会自动识别标题、正文、引用和列表。</div>
            ) : (
              blocks.map((block, index) => (
                <article className="blockRow" key={block.id}>
                  <div className="blockMeta">
                    <span className="blockIndex">{String(index + 1).padStart(2, "0")}</span>
                    <TypeSelect value={block.type} onChange={(type) => updateBlockType(block, type)} />
                  </div>
                  <p className="blockText">
                    {block.type === "divider" ? "分割线" : block.content || block.items?.join(" / ")}
                  </p>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="panel previewPanel">
          <div className="panelHeader">
            <div>
              <h2>排版预览</h2>
              <span>{selectedTemplate.name}</span>
            </div>
            <button className="copyButton" onClick={handleCopy}>
              {copyState === "copied" ? "已复制" : copyState === "error" ? "复制失败" : "复制富文本"}
            </button>
          </div>

          <div className="templateGrid" aria-label="排版模板">
            {templates.map((template) => (
              <button
                key={template.id}
                className={`templateButton ${template.id === selectedTemplate.id ? "selected" : ""}`}
                onClick={() => setTemplateId(template.id)}
                type="button"
              >
                <span className="templateSwatch" style={{ background: template.accent }} />
                <strong>{template.name}</strong>
                <small>{template.scenario}</small>
              </button>
            ))}
          </div>

          <div className="phoneCanvas" style={{ background: selectedTemplate.previewBackground }}>
            <div className="wechatPreview" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

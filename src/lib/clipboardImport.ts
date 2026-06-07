function decodeEntities(value: string) {
  const entities: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: "\"",
    apos: "'",
    nbsp: " "
  };

  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (_, name) => entities[name] ?? `&${name};`);
}

function stripTags(value: string) {
  return decodeEntities(value.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")).trim();
}

function cellText(rowHtml: string, tag: "td" | "th") {
  return Array.from(rowHtml.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi"))).map((match) =>
    stripTags(match[1]).replace(/\s+/g, " ")
  );
}

function convertTables(html: string) {
  return html.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (_, tableHtml) => {
    const rows = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)]
      .map((match) => {
        const headers = cellText(match[1], "th");
        return headers.length ? headers : cellText(match[1], "td");
      })
      .filter((row) => row.length > 0);

    if (rows.length === 0) return "";
    const [headers, ...bodyRows] = rows;
    const divider = headers.map(() => "---");
    return `\n\n| ${headers.join(" | ")} |\n| ${divider.join(" | ")} |\n${bodyRows
      .map((row) => `| ${row.join(" | ")} |`)
      .join("\n")}\n\n`;
  });
}

function convertCodeBlocks(html: string) {
  return html
    .replace(/<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi, (_, code) => {
      return `\n\n\`\`\`\n${stripTags(code)}\n\`\`\`\n\n`;
    })
    .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, code) => {
      return `\n\n\`\`\`\n${stripTags(code)}\n\`\`\`\n\n`;
    });
}

function convertImages(html: string) {
  return html.replace(/<img\b([^>]*)>/gi, (_, attrs) => {
    const src =
      attrs.match(/\ssrc=["']([^"']+)["']/i)?.[1] ??
      attrs.match(/\sdata-src=["']([^"']+)["']/i)?.[1] ??
      "";
    if (!src) return "";
    const alt = attrs.match(/\salt=["']([^"']*)["']/i)?.[1] ?? "图片";
    return `\n\n![${stripTags(alt) || "图片"}](${decodeEntities(src)})\n\n`;
  });
}

function convertBlocks(html: string) {
  return html
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, text) => `\n\n# ${stripTags(text)}\n\n`)
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, text) => `\n\n## ${stripTags(text)}\n\n`)
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, text) => `\n\n> ${stripTags(text)}\n\n`)
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, text) => `\n- ${stripTags(text)}`)
    .replace(/<\/(p|div|section|article|ul|ol)>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n");
}

export function convertClipboardHtmlToMarkdown(html: string) {
  const converted = convertBlocks(convertImages(convertCodeBlocks(convertTables(html))));
  return stripTags(converted)
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function hasStructuredClipboardHtml(html: string) {
  return /<(table|pre|code|img)\b/i.test(html);
}

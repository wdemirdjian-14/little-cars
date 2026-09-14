import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

/** Rend un fichier Markdown de content/ au build (pages légales). */
export function Markdown({ file }: { file: string }) {
  const source = fs.readFileSync(path.join(process.cwd(), "content", file), "utf8");
  const html = (marked.parse(source, { async: false }) as string)
    .replace(/<table>/g, '<div class="table-scroll"><table>')
    .replace(/<\/table>/g, "</table></div>");
  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}

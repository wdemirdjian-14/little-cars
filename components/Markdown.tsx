import { Marked } from "marked";

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Le Markdown vient du back-office : tout HTML brut est affiché comme du texte,
// jamais interprété (pas de <script> ni d'attribut on* injectable).
const md = new Marked({
  renderer: {
    html({ text }) {
      return escape(text);
    },
  },
});

export function Markdown({ source }: { source: string }) {
  const html = (md.parse(source, { async: false }) as string)
    .replace(/<a href="(?!https?:|mailto:|tel:|\/|#)[^"]*"/g, '<a href="#"')
    .replace(/<table>/g, '<div class="table-scroll"><table>')
    .replace(/<\/table>/g, "</table></div>");
  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}

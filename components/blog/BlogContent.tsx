import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

/**
 * Blog govdesini Markdown'dan render eder.
 *
 * Guvenlik: `rehype-sanitize` varsayilan (GitHub) semasiyla tehlikeli HTML
 * (script, iframe, on* olay nitelikleri, javascript: URL'leri) temizlenir —
 * stored XSS'e karsi render-time savunma. `dangerouslySetInnerHTML` KULLANILMAZ.
 *
 * "use client" yok: public detayda build-time (server) render edilir → SEO dostu,
 * sifir istemci JS. Admin onizlemede ayni bilesen istemci tarafinda calisir.
 */
export function BlogContent({ markdown }: { markdown: string }) {
  return (
    <div className="blog-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
        {markdown || ""}
      </ReactMarkdown>
    </div>
  );
}

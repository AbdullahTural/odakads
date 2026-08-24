/**
 * JSON-LD yapilandirilmis veri enjeksiyonu (server-rendered).
 * `<` kacisiyla script'ten cikis (XSS) engellenir.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      // Icerik yalnizca kendi olusturdugumuz nesnelerden gelir; ayrica '<' kacisi uygulanir.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

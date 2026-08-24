"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Eye,
  Loader2,
  Upload,
  X as XIcon,
} from "lucide-react";
import { useAuth } from "@/lib/admin/auth-context";
import {
  checkBlogSlug,
  useBlogPost,
  useCreateBlog,
  useUpdateBlog,
  useUploadBlogCover,
} from "@/lib/admin/hooks";
import type { BlogInput, BlogStatus } from "@/lib/admin/types";
import { Field } from "@/components/admin/parts";
import { Toggle } from "@/components/admin/Toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BlogContent } from "@/components/blog/BlogContent";
import { cn } from "@/lib/utils";
import { estimateReadingMinutes, slugify } from "@/lib/blog/slugify";

const emptyForm: BlogInput = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImageUrl: "",
  coverImageAlt: "",
  category: "",
  tags: [],
  author: "",
  status: "draft",
  publishedAt: null,
  seoTitle: "",
  seoDescription: "",
  canonicalUrl: "",
  ogTitle: "",
  ogDescription: "",
  ogImageUrl: "",
  noIndex: false,
};

const STATUS_OPTIONS: { value: BlogStatus; label: string }[] = [
  { value: "draft", label: "Taslak" },
  { value: "published", label: "Yayında" },
  { value: "archived", label: "Arşiv" },
];

export default function BlogEditorPage() {
  return (
    <React.Suspense
      fallback={
        <div className="grid min-h-[40vh] place-items-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <BlogEditor />
    </React.Suspense>
  );
}

function BlogEditor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [currentId, setCurrentId] = React.useState<string | null>(searchParams.get("id"));
  const { data: existing, isLoading } = useBlogPost(currentId);

  const createM = useCreateBlog();
  const updateM = useUpdateBlog();
  const uploadM = useUploadBlogCover();

  const [form, setForm] = React.useState<BlogInput>(emptyForm);
  const [slugTouched, setSlugTouched] = React.useState(false);
  const [slugState, setSlugState] = React.useState<"idle" | "checking" | "ok" | "taken">("idle");
  const [tagInput, setTagInput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [dirty, setDirty] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);

  const populatedRef = React.useRef(false);
  const coverInputRef = React.useRef<HTMLInputElement>(null);
  const ogInputRef = React.useRef<HTMLInputElement>(null);

  const originalSlug = existing?.slug ?? "";
  const isPublished = existing?.status === "published";

  // Mevcut yaziyi bir kez forma yukle
  React.useEffect(() => {
    if (existing && !populatedRef.current) {
      setForm({
        title: existing.title,
        slug: existing.slug,
        excerpt: existing.excerpt,
        content: existing.content,
        coverImageUrl: existing.coverImageUrl,
        coverImageAlt: existing.coverImageAlt,
        category: existing.category,
        tags: existing.tags ?? [],
        author: existing.author,
        status: existing.status,
        publishedAt: existing.publishedAt,
        seoTitle: existing.seoTitle,
        seoDescription: existing.seoDescription,
        canonicalUrl: existing.canonicalUrl,
        ogTitle: existing.ogTitle,
        ogDescription: existing.ogDescription,
        ogImageUrl: existing.ogImageUrl,
        noIndex: existing.noIndex,
      });
      setSlugTouched(true);
      populatedRef.current = true;
      setDirty(false);
    }
  }, [existing]);

  // Kaydedilmemis degisiklik uyarisi
  React.useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // Slug musaitlik kontrolu (debounce)
  React.useEffect(() => {
    const slug = form.slug.trim();
    if (!slug || slug === originalSlug) {
      setSlugState("idle");
      return;
    }
    setSlugState("checking");
    const t = setTimeout(async () => {
      try {
        const res = await checkBlogSlug(slug, currentId ?? undefined);
        setSlugState(res.available ? "ok" : "taken");
      } catch {
        setSlugState("idle");
      }
    }, 450);
    return () => clearTimeout(t);
  }, [form.slug, originalSlug, currentId]);

  function update<K extends keyof BlogInput>(key: K, value: BlogInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  }

  function onTitleChange(value: string) {
    setForm((f) => ({
      ...f,
      title: value,
      slug: slugTouched ? f.slug : slugify(value),
    }));
    setDirty(true);
  }

  function onSlugChange(value: string) {
    setSlugTouched(true);
    update("slug", slugify(value));
  }

  function addTag() {
    const t = tagInput.trim();
    if (!t) return;
    if (!form.tags.includes(t)) update("tags", [...form.tags, t]);
    setTagInput("");
  }

  async function onUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    field: "coverImageUrl" | "ogImageUrl",
    ref: React.RefObject<HTMLInputElement | null>,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    try {
      const res = await uploadM.mutateAsync(file);
      update(field, res.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Görsel yüklenemedi.");
    } finally {
      if (ref.current) ref.current.value = "";
    }
  }

  async function onSave(statusOverride?: BlogStatus) {
    setError(null);
    const status = statusOverride ?? form.status;
    const payload: BlogInput = {
      ...form,
      status,
      slug: slugify(form.slug || form.title),
      author: form.author.trim() || user?.fullName || "",
    };

    if (!payload.title.trim()) return setError("Başlık zorunludur.");
    if (!payload.excerpt.trim()) return setError("Kısa özet zorunludur.");
    if (!payload.content.trim()) return setError("İçerik zorunludur.");
    if (payload.coverImageUrl && !payload.coverImageAlt.trim())
      return setError("Kapak görseli için alt metin (erişilebilirlik) girin.");

    try {
      if (currentId) {
        await updateM.mutateAsync({ id: currentId, input: payload });
      } else {
        const created = await createM.mutateAsync(payload);
        populatedRef.current = true;
        setCurrentId(created.id);
        router.replace(`/admin/blogs/editor?id=${created.id}`);
      }
      setForm((f) => ({ ...f, status }));
      setDirty(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kaydedilemedi.");
    }
  }

  const saving = createM.isPending || updateM.isPending;
  const readingMinutes = estimateReadingMinutes(form.content);
  const slugChangedWhilePublished = isPublished && form.slug !== originalSlug && originalSlug !== "";

  if (currentId && isLoading && !populatedRef.current) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Ust bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Geri"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-display text-xl font-bold">
              {currentId ? "Yazıyı Düzenle" : "Yeni Yazı"}
            </h1>
            {dirty && <p className="text-xs text-amber-400">Kaydedilmemiş değişiklikler var</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {currentId && !dirty ? (
            <Link
              href={`/admin/blogs/preview?id=${currentId}`}
              target="_blank"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Eye className="h-4 w-4" /> Önizle
            </Link>
          ) : (
            <span
              className="inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-medium text-muted-foreground/50"
              title="Önizlemek için önce kaydedin"
            >
              <Eye className="h-4 w-4" /> Önizle
            </span>
          )}
          <Button type="button" onClick={() => onSave()} disabled={saving}>
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Sol: icerik */}
        <div className="space-y-6">
          <SectionCard>
            <Field label="Başlık *">
              <Input value={form.title} onChange={(e) => onTitleChange(e.target.value)} placeholder="Yazı başlığı" />
            </Field>
            <Field label="Slug (URL) *" hint={`/blog/${form.slug || "..."}`}>
              <Input value={form.slug} onChange={(e) => onSlugChange(e.target.value)} placeholder="otomatik-uretilir" />
              <SlugStatus state={slugState} />
              {slugChangedWhilePublished && (
                <p className="mt-1 text-xs text-amber-400">
                  Yayındaki bir yazının slug&apos;ını değiştiriyorsunuz. Eski adres 301 ile yeni adrese
                  yönlendirilecek şekilde kaydedilir.
                </p>
              )}
            </Field>
            <Field label="Kısa özet *" hint="Liste ve paylaşımlarda görünür (önerilen ≤ 200 karakter).">
              <Textarea
                value={form.excerpt}
                onChange={(e) => update("excerpt", e.target.value)}
                className="min-h-[80px]"
                maxLength={500}
              />
            </Field>
          </SectionCard>

          <SectionCard>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-medium">İçerik (Markdown) *</label>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{readingMinutes} dk okuma</span>
                <button
                  type="button"
                  onClick={() => setShowPreview((v) => !v)}
                  className="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-medium transition-colors hover:text-foreground"
                >
                  {showPreview ? "Düzenle" : "Önizle"}
                </button>
              </div>
            </div>
            {showPreview ? (
              <div className="min-h-[300px] rounded-xl border border-white/10 bg-background/40 p-4">
                <BlogContent markdown={form.content} />
              </div>
            ) : (
              <Textarea
                value={form.content}
                onChange={(e) => update("content", e.target.value)}
                className="min-h-[360px] font-mono text-[0.9rem]"
                placeholder={"# Başlık\n\nParagraf metni. **Kalın**, *italik*, [bağlantı](https://...)\n\n- Liste ögesi"}
              />
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              Markdown desteklenir. Güvenlik için içerik yayında sanitize edilir (script/iframe engellenir).
            </p>
          </SectionCard>

          <SectionCard>
            <Field label="Etiketler">
              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => update("tags", form.tags.filter((t) => t !== tag))}
                      aria-label={`${tag} etiketini kaldır`}
                      className="text-muted-foreground hover:text-red-400"
                    >
                      <XIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Etiket ekleyin, Enter'a basın"
                />
                <Button type="button" variant="outline" size="sm" onClick={addTag}>
                  Ekle
                </Button>
              </div>
            </Field>
          </SectionCard>

          {/* SEO */}
          <SectionCard>
            <h2 className="mb-4 font-display text-base font-semibold">SEO & Sosyal Paylaşım</h2>
            <div className="space-y-4">
              <Field label="SEO Başlığı" hint="Boş bırakılırsa yazı başlığı kullanılır.">
                <Input value={form.seoTitle} onChange={(e) => update("seoTitle", e.target.value)} maxLength={200} />
                <LengthHint len={form.seoTitle.length} ideal={60} />
              </Field>
              <Field label="Meta Açıklama" hint="Boş bırakılırsa kısa özet kullanılır.">
                <Textarea
                  value={form.seoDescription}
                  onChange={(e) => update("seoDescription", e.target.value)}
                  className="min-h-[70px]"
                  maxLength={400}
                />
                <LengthHint len={form.seoDescription.length} ideal={160} />
              </Field>
              <Field label="Canonical URL" hint="Boş bırakılırsa /blog/slug kullanılır.">
                <Input
                  value={form.canonicalUrl}
                  onChange={(e) => update("canonicalUrl", e.target.value)}
                  placeholder="https://odakadsreklam.com/blog/..."
                />
              </Field>
              <Field label="OG Başlığı">
                <Input value={form.ogTitle} onChange={(e) => update("ogTitle", e.target.value)} maxLength={200} />
              </Field>
              <Field label="OG Açıklaması">
                <Textarea
                  value={form.ogDescription}
                  onChange={(e) => update("ogDescription", e.target.value)}
                  className="min-h-[60px]"
                  maxLength={400}
                />
              </Field>
              <Field label="OG Görseli" hint="Boş ise kapak görseli kullanılır (1200×630 önerilir).">
                <div className="flex items-center gap-3">
                  <input
                    ref={ogInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp,.gif,image/png,image/jpeg,image/webp,image/gif"
                    className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary/15 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary"
                    onChange={(e) => onUpload(e, "ogImageUrl", ogInputRef)}
                    disabled={uploadM.isPending}
                  />
                </div>
                {form.ogImageUrl && (
                  <p className="mt-1 truncate text-xs text-muted-foreground">{form.ogImageUrl}</p>
                )}
              </Field>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                <div>
                  <p className="text-sm font-medium">Arama motorlarından gizle (noindex)</p>
                  <p className="text-xs text-muted-foreground">Açıksa yazı indekslenmez ve sitemap&apos;e eklenmez.</p>
                </div>
                <Toggle checked={form.noIndex} onChange={(v) => update("noIndex", v)} />
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Sag: yayin + kapak + meta */}
        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <SectionCard>
            <h2 className="mb-3 font-display text-base font-semibold">Yayınlama</h2>
            <Field label="Durum">
              <select
                value={form.status}
                onChange={(e) => update("status", e.target.value as BlogStatus)}
                className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="bg-card">
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            <div className="mt-4">
              <Field label="Yayın tarihi" hint="Boş = yayınlanınca şimdi. İleri tarih = zamanlanmış (rebuild gerekir).">
                <Input
                  type="datetime-local"
                  value={toLocalInput(form.publishedAt)}
                  onChange={(e) => update("publishedAt", fromLocalInput(e.target.value))}
                />
              </Field>
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <Button type="button" onClick={() => onSave()} disabled={saving}>
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </Button>
              {form.status !== "published" && (
                <Button type="button" variant="outline" onClick={() => onSave("published")} disabled={saving}>
                  Kaydet ve Yayınla
                </Button>
              )}
            </div>
          </SectionCard>

          <SectionCard>
            <h2 className="mb-3 font-display text-base font-semibold">Kapak Görseli</h2>
            {form.coverImageUrl && (
              <div className="mb-3 overflow-hidden rounded-xl border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.coverImageUrl} alt={form.coverImageAlt} className="aspect-[16/9] w-full object-cover" />
              </div>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.webp,.gif,image/png,image/jpeg,image/webp,image/gif"
              className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary/15 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary"
              onChange={(e) => onUpload(e, "coverImageUrl", coverInputRef)}
              disabled={uploadM.isPending}
            />
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              {uploadM.isPending ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" /> Yükleniyor...
                </>
              ) : (
                <>
                  <Upload className="h-3 w-3" /> PNG, JPG, WEBP, GIF — en fazla 5 MB
                </>
              )}
            </p>
            <div className="mt-3">
              <Field label="Kapak alt metni" hint="Erişilebilirlik + SEO için zorunlu (kapak varsa).">
                <Input
                  value={form.coverImageAlt}
                  onChange={(e) => update("coverImageAlt", e.target.value)}
                  placeholder="Görseli betimleyen kısa metin"
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard>
            <div className="space-y-4">
              <Field label="Kategori">
                <Input value={form.category} onChange={(e) => update("category", e.target.value)} placeholder="Örn. Google Ads" />
              </Field>
              <Field label="Yazar" hint={user?.fullName ? `Boş bırakılırsa: ${user.fullName}` : undefined}>
                <Input value={form.author} onChange={(e) => update("author", e.target.value)} placeholder={user?.fullName ?? "Yazar adı"} />
              </Field>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl border border-white/10 bg-card p-5">{children}</section>;
}

function SlugStatus({ state }: { state: "idle" | "checking" | "ok" | "taken" }) {
  if (state === "idle") return null;
  if (state === "checking") return <p className="mt-1 text-xs text-muted-foreground">Kontrol ediliyor...</p>;
  if (state === "ok")
    return (
      <p className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-400">
        <Check className="h-3 w-3" /> Uygun
      </p>
    );
  return <p className="mt-1 text-xs text-red-400">Bu slug zaten kullanılıyor.</p>;
}

function LengthHint({ len, ideal }: { len: number; ideal: number }) {
  const over = len > ideal;
  return (
    <p className={cn("mt-1 text-xs", over ? "text-amber-400" : "text-muted-foreground")}>
      {len} / ~{ideal} karakter{over ? " (biraz uzun)" : ""}
    </p>
  );
}

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
}

function fromLocalInput(v: string): string | null {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

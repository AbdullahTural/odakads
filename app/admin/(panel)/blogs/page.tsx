"use client";

import * as React from "react";
import Link from "next/link";
import { Archive, Eye, EyeOff, Pencil, Send, Trash2 } from "lucide-react";
import {
  useBlogList,
  useChangeBlogStatus,
  useDeleteBlog,
} from "@/lib/admin/hooks";
import type { BlogAdminListItem, BlogStatus } from "@/lib/admin/types";
import {
  PageHeader,
  SearchInput,
  TableCard,
  TableState,
  tdClass,
  thClass,
} from "@/components/admin/parts";
import { ConfirmDialog } from "@/components/admin/Modal";
import { Pagination } from "@/components/admin/Pagination";
import { cn } from "@/lib/utils";
import { formatBlogDate } from "@/lib/blog/format";

const PAGE_SIZE = 10;

const STATUS_FILTERS: { value: "" | BlogStatus; label: string }[] = [
  { value: "", label: "Tümü" },
  { value: "draft", label: "Taslak" },
  { value: "published", label: "Yayında" },
  { value: "archived", label: "Arşiv" },
];

const STATUS_META: Record<BlogStatus, { label: string; className: string }> = {
  draft: { label: "Taslak", className: "bg-white/10 text-muted-foreground" },
  published: { label: "Yayında", className: "bg-emerald-500/15 text-emerald-400" },
  archived: { label: "Arşiv", className: "bg-amber-500/15 text-amber-400" },
};

function StatusBadge({ status }: { status: BlogStatus }) {
  const meta = STATUS_META[status] ?? STATUS_META.draft;
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", meta.className)}>
      {meta.label}
    </span>
  );
}

export default function BlogsAdminPage() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [debounced, setDebounced] = React.useState("");
  const [status, setStatus] = React.useState<"" | BlogStatus>("");
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isError } = useBlogList({
    page,
    pageSize: PAGE_SIZE,
    search: debounced,
    status: status || undefined,
    sortBy: "updated",
  });

  const changeStatus = useChangeBlogStatus();
  const removeM = useDeleteBlog();

  const onChangeStatus = async (id: string, next: BlogStatus) => {
    await changeStatus.mutateAsync({ id, status: next });
  };

  return (
    <>
      <PageHeader
        title="Bloglar"
        description="Yazıları oluşturun, düzenleyin, yayınlayın ve arşivleyin. Yayınlanan yazılar sitede rebuild sonrası görünür."
        action={
          <Link
            href="/admin/blogs/editor"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-glow-blue transition-transform hover:-translate-y-0.5"
          >
            Yeni Yazı
          </Link>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={search} onChange={setSearch} placeholder="Başlık, slug, kategori ara..." />
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value || "all"}
              onClick={() => {
                setStatus(f.value);
                setPage(1);
              }}
              aria-pressed={status === f.value}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                status === f.value
                  ? "border-primary/50 bg-primary/15 text-primary"
                  : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <TableCard>
        <table className="w-full min-w-[860px]">
          <thead className="border-b border-white/10 bg-white/[0.02]">
            <tr>
              <th className={thClass}>Başlık</th>
              <th className={thClass}>Kategori</th>
              <th className={thClass}>Durum</th>
              <th className={thClass}>Yayın</th>
              <th className={`${thClass} text-right`}>İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data?.items.map((item) => (
              <BlogRow
                key={item.id}
                item={item}
                onPublish={() => onChangeStatus(item.id, "published")}
                onUnpublish={() => onChangeStatus(item.id, "draft")}
                onArchive={() => onChangeStatus(item.id, "archived")}
                onDelete={() => setDeleteId(item.id)}
              />
            ))}
          </tbody>
        </table>
        <TableState
          loading={isLoading}
          error={isError}
          empty={!isLoading && !isError && (data?.items.length ?? 0) === 0}
        />
        {data && (
          <Pagination
            page={data.page}
            pageSize={data.pageSize}
            totalCount={data.totalCount}
            onPageChange={setPage}
          />
        )}
      </TableCard>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        loading={removeM.isPending}
        description="Bu blog yazısı KALICI olarak silinecek. (Genelde silmek yerine 'Arşivle' önerilir.)"
        onConfirm={async () => {
          if (deleteId) await removeM.mutateAsync(deleteId);
          setDeleteId(null);
        }}
      />
    </>
  );
}

function IconBtn({
  onClick,
  href,
  label,
  danger,
  children,
}: {
  onClick?: () => void;
  href?: string;
  label: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  const cls = cn(
    "grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-colors",
    danger ? "hover:text-red-400" : "hover:text-primary",
  );
  if (href) {
    return (
      <Link href={href} aria-label={label} title={label} className={cls} target={label === "Önizle" ? "_blank" : undefined}>
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} aria-label={label} title={label} className={cls}>
      {children}
    </button>
  );
}

function BlogRow({
  item,
  onPublish,
  onUnpublish,
  onArchive,
  onDelete,
}: {
  item: BlogAdminListItem;
  onPublish: () => void;
  onUnpublish: () => void;
  onArchive: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="transition-colors hover:bg-white/[0.02]">
      <td className={tdClass}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-14 shrink-0 overflow-hidden rounded-md border border-white/10 bg-white/[0.03]">
            {item.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.coverImageUrl} alt="" className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{item.title}</p>
            <p className="truncate text-xs text-muted-foreground">/blog/{item.slug}</p>
          </div>
        </div>
      </td>
      <td className={tdClass}>{item.category || "—"}</td>
      <td className={tdClass}>
        <StatusBadge status={item.status} />
      </td>
      <td className={tdClass}>
        {item.publishedAt ? formatBlogDate(item.publishedAt) : "—"}
      </td>
      <td className={`${tdClass} text-right`}>
        <div className="flex justify-end gap-2">
          <IconBtn href={`/admin/blogs/editor?id=${item.id}`} label="Düzenle">
            <Pencil className="h-4 w-4" />
          </IconBtn>
          <IconBtn href={`/admin/blogs/preview?id=${item.id}`} label="Önizle">
            <Eye className="h-4 w-4" />
          </IconBtn>
          {item.status !== "published" ? (
            <IconBtn onClick={onPublish} label="Yayınla">
              <Send className="h-4 w-4" />
            </IconBtn>
          ) : (
            <IconBtn onClick={onUnpublish} label="Yayından kaldır">
              <EyeOff className="h-4 w-4" />
            </IconBtn>
          )}
          {item.status !== "archived" && (
            <IconBtn onClick={onArchive} label="Arşivle">
              <Archive className="h-4 w-4" />
            </IconBtn>
          )}
          <IconBtn onClick={onDelete} label="Kalıcı sil" danger>
            <Trash2 className="h-4 w-4" />
          </IconBtn>
        </div>
      </td>
    </tr>
  );
}

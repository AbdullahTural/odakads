"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { reviewsHooks } from "@/lib/admin/hooks";
import type { ReviewInput, ReviewItem } from "@/lib/admin/types";
import {
  AddButton,
  Field,
  PageHeader,
  RowActions,
  SearchInput,
  StatusPill,
  TableCard,
  TableState,
  tdClass,
  thClass,
} from "@/components/admin/parts";
import { Modal, ConfirmDialog } from "@/components/admin/Modal";
import { Pagination } from "@/components/admin/Pagination";
import { Toggle } from "@/components/admin/Toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const PAGE_SIZE = 10;

const emptyForm: ReviewInput = {
  author: "",
  service: "",
  rating: 5,
  comment: "",
  date: new Date().toISOString().slice(0, 10),
  source: "Armut",
  companyLogoUrl: "",
  isActive: true,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ReviewsAdminPage() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [debounced, setDebounced] = React.useState("");

  React.useEffect(() => {
    const t = setTimeout(() => { setDebounced(search); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isError } = reviewsHooks.useList({
    page,
    pageSize: PAGE_SIZE,
    search: debounced,
    sortBy: "date",
    sortDirection: "desc",
  });
  const createM = reviewsHooks.useCreate();
  const updateM = reviewsHooks.useUpdate();
  const removeM = reviewsHooks.useRemove();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ReviewItem | null>(null);
  const [form, setForm] = React.useState<ReviewInput>(emptyForm);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (item: ReviewItem) => {
    setEditing(item);
    setForm({
      author: item.author,
      service: item.service,
      rating: item.rating,
      comment: item.comment,
      date: item.date.slice(0, 10),
      source: item.source,
      companyLogoUrl: item.companyLogoUrl ?? "",
      isActive: item.isActive,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const onSave = async () => {
    setFormError(null);
    try {
      if (editing) await updateM.mutateAsync({ id: editing.id, input: form });
      else await createM.mutateAsync(form);
      setModalOpen(false);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Kaydedilemedi.");
    }
  };

  const saving = createM.isPending || updateM.isPending;

  return (
    <>
      <PageHeader
        title="Armut Yorumları"
        description="Başarılarımız sayfasındaki Armut platformu değerlendirmeleri."
        action={<AddButton onClick={openCreate} label="Yeni Yorum" />}
      />
      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="İsim, hizmet veya yorum ara..." />
      </div>

      <TableCard>
        <table className="w-full min-w-[720px]">
          <thead className="border-b border-white/10 bg-white/[0.02]">
            <tr>
              <th className={thClass}>İsim</th>
              <th className={thClass}>Tarih</th>
              <th className={thClass}>Hizmet</th>
              <th className={thClass}>Puan</th>
              <th className={thClass}>Durum</th>
              <th className={`${thClass} text-right`}>İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data?.items.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-white/[0.02]">
                <td className={`${tdClass} font-medium`}>{item.author}</td>
                <td className={tdClass}>{formatDate(item.date)}</td>
                <td className={tdClass}>{item.service}</td>
                <td className={tdClass}>
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {item.rating}
                  </span>
                </td>
                <td className={tdClass}><StatusPill active={item.isActive} /></td>
                <td className={`${tdClass} text-right`}>
                  <RowActions onEdit={() => openEdit(item)} onDelete={() => setDeleteId(item.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <TableState loading={isLoading} error={isError} empty={!isLoading && !isError && (data?.items.length ?? 0) === 0} />
        {data && (
          <Pagination
            page={data.page}
            pageSize={data.pageSize}
            totalCount={data.totalCount}
            onPageChange={setPage}
          />
        )}
      </TableCard>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Yorumu Düzenle" : "Yeni Armut Yorumu"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="İsim">
              <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </Field>
            <Field label="Tarih">
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </Field>
            <Field label="Hizmet etiketi">
              <Input value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} />
            </Field>
            <Field label="Puan (1-5)">
              <Input
                type="number"
                min={1}
                max={5}
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              />
            </Field>
            <Field label="Kaynak">
              <Input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
            </Field>
            <Field label="Firma Logosu (opsiyonel)">
              <Input
                type="url"
                placeholder="https://..."
                value={form.companyLogoUrl ?? ""}
                onChange={(e) => setForm({ ...form, companyLogoUrl: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Yorum">
            <Textarea
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              rows={5}
            />
          </Field>
          <Toggle checked={form.isActive} onChange={(v) => setForm({ ...form, isActive: v })} label="Aktif" />
          {formError && <p className="text-sm text-red-400">{formError}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>İptal</Button>
            <Button type="button" onClick={onSave} disabled={saving}>
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        loading={removeM.isPending}
        description="Bu Armut yorumu kalıcı olarak silinecek."
        onConfirm={async () => {
          if (deleteId) await removeM.mutateAsync(deleteId);
          setDeleteId(null);
        }}
      />
    </>
  );
}

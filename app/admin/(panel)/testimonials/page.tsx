"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { testimonialsHooks } from "@/lib/admin/hooks";
import type { TestimonialInput, TestimonialItem } from "@/lib/admin/types";
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
const emptyForm: TestimonialInput = {
  name: "",
  role: "",
  company: "",
  avatarUrl: "",
  rating: 5,
  content: "",
  isFeatured: false,
  isActive: true,
};

export default function TestimonialsAdminPage() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [debounced, setDebounced] = React.useState("");

  React.useEffect(() => {
    const t = setTimeout(() => { setDebounced(search); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isError } = testimonialsHooks.useList({ page, pageSize: PAGE_SIZE, search: debounced });
  const createM = testimonialsHooks.useCreate();
  const updateM = testimonialsHooks.useUpdate();
  const removeM = testimonialsHooks.useRemove();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<TestimonialItem | null>(null);
  const [form, setForm] = React.useState<TestimonialInput>(emptyForm);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFormError(null); setModalOpen(true); };
  const openEdit = (item: TestimonialItem) => {
    setEditing(item);
    setForm({
      name: item.name, role: item.role, company: item.company,
      avatarUrl: item.avatarUrl ?? "", rating: item.rating, content: item.content,
      isFeatured: item.isFeatured, isActive: item.isActive,
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
        title="Referanslar"
        description="Yazılı müşteri referansları."
        action={<AddButton onClick={openCreate} label="Yeni Referans" />}
      />
      <div className="mb-4"><SearchInput value={search} onChange={setSearch} placeholder="İsim, firma ara..." /></div>

      <TableCard>
        <table className="w-full min-w-[680px]">
          <thead className="border-b border-white/10 bg-white/[0.02]">
            <tr>
              <th className={thClass}>İsim</th>
              <th className={thClass}>Firma</th>
              <th className={thClass}>Puan</th>
              <th className={thClass}>Öne Çıkan</th>
              <th className={thClass}>Durum</th>
              <th className={`${thClass} text-right`}>İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data?.items.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-white/[0.02]">
                <td className={`${tdClass} font-medium`}>{item.name}<div className="text-xs text-muted-foreground">{item.role}</div></td>
                <td className={tdClass}>{item.company}</td>
                <td className={tdClass}>
                  <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{item.rating}</span>
                </td>
                <td className={tdClass}>{item.isFeatured ? "Evet" : "—"}</td>
                <td className={tdClass}><StatusPill active={item.isActive} /></td>
                <td className={`${tdClass} text-right`}>
                  <RowActions onEdit={() => openEdit(item)} onDelete={() => setDeleteId(item.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <TableState loading={isLoading} error={isError} empty={!isLoading && !isError && (data?.items.length ?? 0) === 0} />
        {data && <Pagination page={data.page} pageSize={data.pageSize} totalCount={data.totalCount} onPageChange={setPage} />}
      </TableCard>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Referansı Düzenle" : "Yeni Referans"} size="lg">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="İsim"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Ünvan"><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></Field>
            <Field label="Firma"><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></Field>
            <Field label="Puan (1-5)"><Input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} /></Field>
          </div>
          <Field label="Avatar URL (opsiyonel)"><Input value={form.avatarUrl ?? ""} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} /></Field>
          <Field label="Yorum"><Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></Field>
          <div className="flex flex-wrap gap-6">
            <Toggle checked={form.isFeatured} onChange={(v) => setForm({ ...form, isFeatured: v })} label="Öne çıkan" />
            <Toggle checked={form.isActive} onChange={(v) => setForm({ ...form, isActive: v })} label="Aktif" />
          </div>
          {formError && <p className="text-sm text-red-400">{formError}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>İptal</Button>
            <Button type="button" onClick={onSave} disabled={saving}>{saving ? "Kaydediliyor..." : "Kaydet"}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        loading={removeM.isPending}
        description="Bu referans kalıcı olarak silinecek."
        onConfirm={async () => { if (deleteId) await removeM.mutateAsync(deleteId); setDeleteId(null); }}
      />
    </>
  );
}

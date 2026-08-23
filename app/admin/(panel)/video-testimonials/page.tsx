"use client";

import * as React from "react";
import { videosHooks } from "@/lib/admin/hooks";
import type { VideoInput, VideoItem } from "@/lib/admin/types";
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
const emptyForm: VideoInput = {
  name: "",
  company: "",
  thumbnailUrl: "",
  videoUrl: "",
  duration: "",
  quote: "",
  displayOrder: 0,
  isActive: true,
};

export default function VideoTestimonialsAdminPage() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [debounced, setDebounced] = React.useState("");

  React.useEffect(() => {
    const t = setTimeout(() => { setDebounced(search); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isError } = videosHooks.useList({ page, pageSize: PAGE_SIZE, search: debounced, sortBy: "displayOrder" });
  const createM = videosHooks.useCreate();
  const updateM = videosHooks.useUpdate();
  const removeM = videosHooks.useRemove();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<VideoItem | null>(null);
  const [form, setForm] = React.useState<VideoInput>(emptyForm);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFormError(null); setModalOpen(true); };
  const openEdit = (item: VideoItem) => {
    setEditing(item);
    setForm({
      name: item.name, company: item.company, thumbnailUrl: item.thumbnailUrl ?? "",
      videoUrl: item.videoUrl, duration: item.duration, quote: item.quote,
      displayOrder: item.displayOrder, isActive: item.isActive,
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
        title="Video Referanslar"
        description="Başarılarımız sayfasındaki video referanslar."
        action={<AddButton onClick={openCreate} label="Yeni Video" />}
      />
      <div className="mb-4"><SearchInput value={search} onChange={setSearch} placeholder="İsim, firma ara..." /></div>

      <TableCard>
        <table className="w-full min-w-[640px]">
          <thead className="border-b border-white/10 bg-white/[0.02]">
            <tr>
              <th className={thClass}>Sıra</th>
              <th className={thClass}>İsim</th>
              <th className={thClass}>Firma</th>
              <th className={thClass}>Süre</th>
              <th className={thClass}>Durum</th>
              <th className={`${thClass} text-right`}>İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data?.items.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-white/[0.02]">
                <td className={tdClass}>{item.displayOrder}</td>
                <td className={`${tdClass} font-medium`}>{item.name}</td>
                <td className={tdClass}>{item.company}</td>
                <td className={`${tdClass} text-muted-foreground`}>{item.duration}</td>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Videoyu Düzenle" : "Yeni Video"} size="lg">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="İsim"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Firma"><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></Field>
            <Field label="Video URL (embed)" hint="Örn: https://www.youtube.com/embed/XXXX"><Input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} /></Field>
            <Field label="Kapak Görseli URL (opsiyonel)"><Input value={form.thumbnailUrl ?? ""} onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })} /></Field>
            <Field label="Süre" hint="Örn: 2:14"><Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></Field>
            <Field label="Sıra"><Input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} /></Field>
          </div>
          <Field label="Alıntı"><Textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} /></Field>
          <Toggle checked={form.isActive} onChange={(v) => setForm({ ...form, isActive: v })} label="Aktif" />
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
        description="Bu video referans kalıcı olarak silinecek."
        onConfirm={async () => { if (deleteId) await removeM.mutateAsync(deleteId); setDeleteId(null); }}
      />
    </>
  );
}

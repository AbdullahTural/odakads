"use client";

import * as React from "react";
import { Plus, Trash2, TrendingUp } from "lucide-react";
import { caseStudiesHooks } from "@/lib/admin/hooks";
import type { CaseStudyInput, CaseStudyItem, CaseStudyMetric } from "@/lib/admin/types";
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
const emptyForm: CaseStudyInput = {
  client: "",
  industry: "",
  summary: "",
  growth: "",
  tags: [],
  metrics: [],
  displayOrder: 0,
  isActive: true,
};

export default function CaseStudiesAdminPage() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [debounced, setDebounced] = React.useState("");

  React.useEffect(() => {
    const t = setTimeout(() => { setDebounced(search); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isError } = caseStudiesHooks.useList({ page, pageSize: PAGE_SIZE, search: debounced, sortBy: "displayOrder" });
  const createM = caseStudiesHooks.useCreate();
  const updateM = caseStudiesHooks.useUpdate();
  const removeM = caseStudiesHooks.useRemove();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<CaseStudyItem | null>(null);
  const [form, setForm] = React.useState<CaseStudyInput>(emptyForm);
  const [tagsText, setTagsText] = React.useState("");
  const [metrics, setMetrics] = React.useState<CaseStudyMetric[]>([]);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const openCreate = () => {
    setEditing(null); setForm(emptyForm); setTagsText(""); setMetrics([]); setFormError(null); setModalOpen(true);
  };
  const openEdit = (item: CaseStudyItem) => {
    setEditing(item);
    setForm({
      client: item.client, industry: item.industry, summary: item.summary,
      growth: item.growth, tags: item.tags, metrics: item.metrics,
      displayOrder: item.displayOrder, isActive: item.isActive,
    });
    setTagsText(item.tags.join(", "));
    setMetrics(item.metrics.map((m) => ({ ...m })));
    setFormError(null);
    setModalOpen(true);
  };

  const addMetric = () => setMetrics([...metrics, { label: "", before: "", after: "" }]);
  const updateMetric = (i: number, key: keyof CaseStudyMetric, val: string) =>
    setMetrics(metrics.map((m, idx) => (idx === i ? { ...m, [key]: val } : m)));
  const removeMetric = (i: number) => setMetrics(metrics.filter((_, idx) => idx !== i));

  const onSave = async () => {
    setFormError(null);
    const payload: CaseStudyInput = {
      ...form,
      tags: tagsText.split(",").map((s) => s.trim()).filter(Boolean),
      metrics: metrics.filter((m) => m.label.trim()),
    };
    try {
      if (editing) await updateM.mutateAsync({ id: editing.id, input: payload });
      else await createM.mutateAsync(payload);
      setModalOpen(false);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Kaydedilemedi.");
    }
  };

  const saving = createM.isPending || updateM.isPending;

  return (
    <>
      <PageHeader
        title="Vaka Çalışmaları"
        description="Önce/sonra başarı hikayeleri."
        action={<AddButton onClick={openCreate} label="Yeni Vaka" />}
      />
      <div className="mb-4"><SearchInput value={search} onChange={setSearch} placeholder="Müşteri, sektör ara..." /></div>

      <TableCard>
        <table className="w-full min-w-[680px]">
          <thead className="border-b border-white/10 bg-white/[0.02]">
            <tr>
              <th className={thClass}>Sıra</th>
              <th className={thClass}>Müşteri</th>
              <th className={thClass}>Sektör</th>
              <th className={thClass}>Büyüme</th>
              <th className={thClass}>Durum</th>
              <th className={`${thClass} text-right`}>İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data?.items.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-white/[0.02]">
                <td className={tdClass}>{item.displayOrder}</td>
                <td className={`${tdClass} font-medium`}>{item.client}</td>
                <td className={tdClass}>{item.industry}</td>
                <td className={tdClass}>
                  <span className="inline-flex items-center gap-1 text-emerald-400"><TrendingUp className="h-3.5 w-3.5" />{item.growth}</span>
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
        {data && <Pagination page={data.page} pageSize={data.pageSize} totalCount={data.totalCount} onPageChange={setPage} />}
      </TableCard>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Vakayı Düzenle" : "Yeni Vaka"} size="lg">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Müşteri"><Input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} /></Field>
            <Field label="Sektör"><Input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} /></Field>
            <Field label="Büyüme" hint="Örn: +380%"><Input value={form.growth} onChange={(e) => setForm({ ...form, growth: e.target.value })} /></Field>
            <Field label="Sıra"><Input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} /></Field>
          </div>
          <Field label="Özet"><Textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></Field>
          <Field label="Etiketler (virgülle ayırın)" hint="Örn: Performance Max, Remarketing">
            <Input value={tagsText} onChange={(e) => setTagsText(e.target.value)} />
          </Field>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground/90">Metrikler (önce / sonra)</span>
              <button type="button" onClick={addMetric} className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium hover:bg-white/10">
                <Plus className="h-3.5 w-3.5" /> Metrik Ekle
              </button>
            </div>
            <div className="space-y-2">
              {metrics.map((m, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
                  <Input placeholder="Etiket" value={m.label} onChange={(e) => updateMetric(i, "label", e.target.value)} />
                  <Input placeholder="Önce" value={m.before} onChange={(e) => updateMetric(i, "before", e.target.value)} />
                  <Input placeholder="Sonra" value={m.after} onChange={(e) => updateMetric(i, "after", e.target.value)} />
                  <button type="button" onClick={() => removeMetric(i)} className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground hover:text-red-400" aria-label="Metriği sil">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {metrics.length === 0 && <p className="text-xs text-muted-foreground">Henüz metrik yok.</p>}
            </div>
          </div>

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
        description="Bu vaka çalışması kalıcı olarak silinecek."
        onConfirm={async () => { if (deleteId) await removeM.mutateAsync(deleteId); setDeleteId(null); }}
      />
    </>
  );
}

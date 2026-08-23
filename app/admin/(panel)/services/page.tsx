"use client";

import * as React from "react";
import { servicesHooks } from "@/lib/admin/hooks";
import type { ServiceInput, ServiceItem } from "@/lib/admin/types";
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

const emptyForm: ServiceInput = {
  slug: "",
  title: "",
  description: "",
  icon: "Target",
  features: [],
  order: 0,
  isActive: true,
};

export default function ServicesAdminPage() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [debounced, setDebounced] = React.useState("");

  React.useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isError } = servicesHooks.useList({
    page,
    pageSize: PAGE_SIZE,
    search: debounced,
    sortBy: "order",
  });
  const createM = servicesHooks.useCreate();
  const updateM = servicesHooks.useUpdate();
  const removeM = servicesHooks.useRemove();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ServiceItem | null>(null);
  const [form, setForm] = React.useState<ServiceInput>(emptyForm);
  const [featuresText, setFeaturesText] = React.useState("");
  const [formError, setFormError] = React.useState<string | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFeaturesText("");
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (item: ServiceItem) => {
    setEditing(item);
    setForm({
      slug: item.slug,
      title: item.title,
      description: item.description,
      icon: item.icon,
      features: item.features,
      order: item.order,
      isActive: item.isActive,
    });
    setFeaturesText(item.features.join("\n"));
    setFormError(null);
    setModalOpen(true);
  };

  const onSave = async () => {
    setFormError(null);
    const payload: ServiceInput = {
      ...form,
      features: featuresText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    try {
      if (editing) {
        await updateM.mutateAsync({ id: editing.id, input: payload });
      } else {
        await createM.mutateAsync(payload);
      }
      setModalOpen(false);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Kaydedilemedi.");
    }
  };

  const saving = createM.isPending || updateM.isPending;

  return (
    <>
      <PageHeader
        title="Hizmetler"
        description="Sitede görünen hizmet kartları."
        action={<AddButton onClick={openCreate} label="Yeni Hizmet" />}
      />

      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Hizmet ara..." />
      </div>

      <TableCard>
        <table className="w-full min-w-[640px]">
          <thead className="border-b border-white/10 bg-white/[0.02]">
            <tr>
              <th className={thClass}>Sıra</th>
              <th className={thClass}>Başlık</th>
              <th className={thClass}>İkon</th>
              <th className={thClass}>Durum</th>
              <th className={`${thClass} text-right`}>İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data?.items.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-white/[0.02]">
                <td className={tdClass}>{item.order}</td>
                <td className={`${tdClass} font-medium`}>{item.title}</td>
                <td className={`${tdClass} text-muted-foreground`}>{item.icon}</td>
                <td className={tdClass}><StatusPill active={item.isActive} /></td>
                <td className={`${tdClass} text-right`}>
                  <RowActions onEdit={() => openEdit(item)} onDelete={() => setDeleteId(item.id)} />
                </td>
              </tr>
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Hizmeti Düzenle" : "Yeni Hizmet"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Başlık">
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Field>
            <Field label="Slug">
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </Field>
            <Field label="İkon (Lucide adı)" hint="Örn: Target, Search, Youtube, Zap">
              <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
            </Field>
            <Field label="Sıra">
              <Input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
            </Field>
          </div>
          <Field label="Açıklama">
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <Field label="Özellikler (her satır bir madde)">
            <Textarea
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              placeholder={"Hesap denetimi\nBütçe optimizasyonu"}
            />
          </Field>
          <Toggle checked={form.isActive} onChange={(v) => setForm({ ...form, isActive: v })} label="Aktif" />

          {formError && <p className="text-sm text-red-400">{formError}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)} type="button">İptal</Button>
            <Button onClick={onSave} disabled={saving} type="button">
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        loading={removeM.isPending}
        description="Bu hizmet kalıcı olarak silinecek."
        onConfirm={async () => {
          if (deleteId) await removeM.mutateAsync(deleteId);
          setDeleteId(null);
        }}
      />
    </>
  );
}

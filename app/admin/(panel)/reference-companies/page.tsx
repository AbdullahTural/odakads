"use client";

import * as React from "react";
import Image from "next/image";
import {
  referenceCompaniesHooks,
  useUploadReferenceCompanyLogo,
} from "@/lib/admin/hooks";
import type { ReferenceCompanyInput, ReferenceCompanyItem } from "@/lib/admin/types";
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

const PAGE_SIZE = 10;

const emptyForm: ReferenceCompanyInput = {
  name: "",
  logoUrl: "",
  displayOrder: 0,
  isActive: true,
};

export default function ReferenceCompaniesAdminPage() {
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

  const { data, isLoading, isError } = referenceCompaniesHooks.useList({
    page,
    pageSize: PAGE_SIZE,
    search: debounced,
    sortBy: "displayOrder",
  });
  const createM = referenceCompaniesHooks.useCreate();
  const updateM = referenceCompaniesHooks.useUpdate();
  const removeM = referenceCompaniesHooks.useRemove();
  const uploadM = useUploadReferenceCompanyLogo();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ReferenceCompanyItem | null>(null);
  const [form, setForm] = React.useState<ReferenceCompanyInput>(emptyForm);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (item: ReferenceCompanyItem) => {
    setEditing(item);
    setForm({
      name: item.name,
      logoUrl: item.logoUrl,
      displayOrder: item.displayOrder,
      isActive: item.isActive,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormError(null);
    try {
      const result = await uploadM.mutateAsync(file);
      setForm((f) => ({ ...f, logoUrl: result.url }));
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Logo yüklenemedi.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onSave = async () => {
    setFormError(null);
    if (!form.logoUrl.trim()) {
      setFormError("Lütfen bir logo dosyası yükleyin.");
      return;
    }
    try {
      if (editing) await updateM.mutateAsync({ id: editing.id, input: form });
      else await createM.mutateAsync(form);
      setModalOpen(false);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Kaydedilemedi.");
    }
  };

  const saving = createM.isPending || updateM.isPending;
  const uploading = uploadM.isPending;

  return (
    <>
      <PageHeader
        title="Referans Firmalar"
        description="Logo şeridinde gösterilecek referans firmaları. En az 3 aktif firma olunca site bölümü görünür."
        action={<AddButton onClick={openCreate} label="Yeni Firma" />}
      />
      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Firma adı ara..." />
      </div>

      <TableCard>
        <table className="w-full min-w-[720px]">
          <thead className="border-b border-white/10 bg-white/[0.02]">
            <tr>
              <th className={thClass}>Logo</th>
              <th className={thClass}>Firma</th>
              <th className={thClass}>Sıra</th>
              <th className={thClass}>Durum</th>
              <th className={`${thClass} text-right`}>İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data?.items.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-white/[0.02]">
                <td className={tdClass}>
                  <div className="relative h-10 w-16 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] p-1">
                    <Image
                      src={item.logoUrl}
                      alt=""
                      width={64}
                      height={40}
                      className="h-full w-full object-contain"
                      unoptimized
                    />
                  </div>
                </td>
                <td className={`${tdClass} font-medium`}>{item.name}</td>
                <td className={tdClass}>{item.displayOrder}</td>
                <td className={tdClass}>
                  <StatusPill active={item.isActive} />
                </td>
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
        title={editing ? "Firmayı Düzenle" : "Yeni Referans Firma"}
      >
        <div className="space-y-4">
          <Field label="Firma adı">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Logo dosyası">
            <input
              ref={fileRef}
              type="file"
              accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml"
              className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary/15 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary"
              onChange={onFileChange}
              disabled={uploading}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              PNG, JPG, WEBP veya SVG — en fazla 2 MB
            </p>
          </Field>
          {form.logoUrl && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Önizleme</p>
              <div className="relative mx-auto flex h-16 w-full max-w-[200px] items-center justify-center rounded-lg border border-white/5 bg-card p-2">
                <Image
                  src={form.logoUrl}
                  alt=""
                  width={160}
                  height={56}
                  className="max-h-12 w-auto max-w-full object-contain"
                  unoptimized
                />
              </div>
            </div>
          )}
          <Field label="Sıralama (DisplayOrder)">
            <Input
              type="number"
              value={form.displayOrder}
              onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
            />
          </Field>
          <Toggle checked={form.isActive} onChange={(v) => setForm({ ...form, isActive: v })} label="Aktif" />
          {formError && <p className="text-sm text-red-400">{formError}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>
              İptal
            </Button>
            <Button type="button" onClick={onSave} disabled={saving || uploading}>
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        loading={removeM.isPending}
        description="Bu referans firma kalıcı olarak silinecek."
        onConfirm={async () => {
          if (deleteId) await removeM.mutateAsync(deleteId);
          setDeleteId(null);
        }}
      />
    </>
  );
}

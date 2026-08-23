"use client";

import * as React from "react";
import { Eye, Mail, MailOpen, Trash2 } from "lucide-react";
import { useContactRequests, useDeleteContact, useMarkContactRead } from "@/lib/admin/hooks";
import type { ContactItem } from "@/lib/admin/types";
import {
  PageHeader,
  SearchInput,
  TableCard,
  TableState,
  tdClass,
  thClass,
} from "@/components/admin/parts";
import { Modal, ConfirmDialog } from "@/components/admin/Modal";
import { Pagination } from "@/components/admin/Pagination";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" });
}

export default function ContactRequestsAdminPage() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [debounced, setDebounced] = React.useState("");

  React.useEffect(() => {
    const t = setTimeout(() => { setDebounced(search); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isError } = useContactRequests({ page, pageSize: PAGE_SIZE, search: debounced });
  const markReadM = useMarkContactRead();
  const deleteM = useDeleteContact();

  const [viewing, setViewing] = React.useState<ContactItem | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const openView = (item: ContactItem) => {
    setViewing(item);
    if (!item.isRead) markReadM.mutate(item.id);
  };

  return (
    <>
      <PageHeader title="İletişim Talepleri" description="Web sitesi formundan gelen mesajlar." />
      <div className="mb-4"><SearchInput value={search} onChange={setSearch} placeholder="İsim, e-posta, firma ara..." /></div>

      <TableCard>
        <table className="w-full min-w-[720px]">
          <thead className="border-b border-white/10 bg-white/[0.02]">
            <tr>
              <th className={thClass}>Durum</th>
              <th className={thClass}>Ad Soyad</th>
              <th className={thClass}>Firma</th>
              <th className={thClass}>Hizmet</th>
              <th className={thClass}>Tarih</th>
              <th className={`${thClass} text-right`}>İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data?.items.map((item) => (
              <tr
                key={item.id}
                className={cn("transition-colors hover:bg-white/[0.02]", !item.isRead && "bg-primary/[0.04]")}
              >
                <td className={tdClass}>
                  {item.isRead ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><MailOpen className="h-4 w-4" /> Okundu</span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary"><Mail className="h-4 w-4" /> Yeni</span>
                  )}
                </td>
                <td className={`${tdClass} font-medium`}>{item.fullName}<div className="text-xs text-muted-foreground">{item.email}</div></td>
                <td className={tdClass}>{item.company}</td>
                <td className={tdClass}>{item.serviceType}</td>
                <td className={`${tdClass} text-muted-foreground`}>{formatDate(item.createdDate)}</td>
                <td className={`${tdClass} text-right`}>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openView(item)} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground hover:text-primary" aria-label="Görüntüle">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleteId(item.id)} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground hover:text-red-400" aria-label="Sil">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <TableState loading={isLoading} error={isError} empty={!isLoading && !isError && (data?.items.length ?? 0) === 0} />
        {data && <Pagination page={data.page} pageSize={data.pageSize} totalCount={data.totalCount} onPageChange={setPage} />}
      </TableCard>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="İletişim Talebi" size="lg">
        {viewing && (
          <div className="space-y-4 text-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="Ad Soyad" value={viewing.fullName} />
              <Info label="Firma" value={viewing.company} />
              <Info label="E-posta" value={<a className="text-primary hover:underline" href={`mailto:${viewing.email}`}>{viewing.email}</a>} />
              <Info label="Telefon" value={<a className="text-primary hover:underline" href={`tel:${viewing.phone}`}>{viewing.phone}</a>} />
              <Info label="Hizmet Türü" value={viewing.serviceType} />
              <Info label="Tarih" value={formatDate(viewing.createdDate)} />
            </div>
            <div>
              <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Mesaj</p>
              <p className="whitespace-pre-wrap rounded-xl border border-white/10 bg-white/[0.03] p-4 leading-relaxed">{viewing.message}</p>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" type="button" onClick={() => setViewing(null)}>Kapat</Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        loading={deleteM.isPending}
        description="Bu iletişim talebi kalıcı olarak silinecek."
        onConfirm={async () => { if (deleteId) await deleteM.mutateAsync(deleteId); setDeleteId(null); }}
      />
    </>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium">{value}</p>
    </div>
  );
}

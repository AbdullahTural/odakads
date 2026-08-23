"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import {
  contactSchema,
  serviceTypeOptions,
  type ContactFormValues,
} from "@/lib/validations";
import { useContactMutation } from "@/lib/api/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ContactForm({
  title,
  subtitle,
}: {
  title?: string;
  subtitle?: string;
} = {}) {
  const mutation = useContactMutation();
  // Form yuklenme zamani (cok hizli/bot gonderim tespiti icin backend'e iletilir).
  const formLoadedAt = React.useRef(new Date().toISOString());

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      company: "",
      serviceType: "",
      message: "",
      website: "",
    },
  });

  const serviceType = watch("serviceType");

  const onSubmit = (values: ContactFormValues) => {
    mutation.mutate(
      { ...values, formLoadedAt: formLoadedAt.current },
      { onSuccess: () => reset() },
    );
  };

  if (mutation.isSuccess) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-10 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h3 className="font-display text-xl font-semibold">
          Mesajınız alındı!
        </h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Talebiniz için teşekkürler. Ekibimiz en kısa sürede sizinle iletişime
          geçecek. Genellikle 24 saat içinde dönüş yapıyoruz.
        </p>
        <Button variant="outline" onClick={() => mutation.reset()}>
          Yeni Mesaj Gönder
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-8"
    >
      {(title || subtitle) && (
        <div className="mb-1">
          {title && (
            <h2 className="font-display text-xl font-bold sm:text-2xl">{title}</h2>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      )}

      {/* Honeypot (gizli) */}
      <div className="hidden" aria-hidden>
        <label htmlFor="website">Web siteniz</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="fullName"
          label="Ad Soyad"
          error={errors.fullName?.message}
        >
          <Input
            id="fullName"
            placeholder="Adınız Soyadınız"
            aria-invalid={!!errors.fullName}
            {...register("fullName")}
          />
        </Field>

        <Field id="phone" label="Telefon" error={errors.phone?.message}>
          <Input
            id="phone"
            type="tel"
            placeholder="0 (5__) ___ __ __"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
        </Field>

        <Field id="email" label="E-posta" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            placeholder="ornek@firma.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </Field>

        <Field id="company" label="Firma Adı" error={errors.company?.message}>
          <Input
            id="company"
            placeholder="Firmanızın adı"
            aria-invalid={!!errors.company}
            {...register("company")}
          />
        </Field>
      </div>

      <Field
        id="serviceType"
        label="Hizmet Türü"
        error={errors.serviceType?.message}
      >
        <Select
          value={serviceType}
          onValueChange={(val) =>
            setValue("serviceType", val, { shouldValidate: true })
          }
        >
          <SelectTrigger aria-invalid={!!errors.serviceType}>
            <SelectValue placeholder="İlgilendiğiniz hizmeti seçin" />
          </SelectTrigger>
          <SelectContent>
            {serviceTypeOptions.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field id="message" label="Mesaj" error={errors.message?.message}>
        <Textarea
          id="message"
          placeholder="Hedeflerinizden ve mevcut durumunuzdan kısaca bahsedin..."
          aria-invalid={!!errors.message}
          {...register("message")}
        />
      </Field>

      {mutation.isError && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-red-300">
          {mutation.error instanceof Error
            ? mutation.error.message
            : "Mesaj gönderilirken bir hata oluştu."}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Gönderiliyor...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Mesajı Gönder
          </>
        )}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Bilgileriniz yalnızca size dönüş yapmak için kullanılır, üçüncü
        taraflarla paylaşılmaz.
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

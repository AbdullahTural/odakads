"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { ArrowRight, BadgeCheck, Star } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";

import { useReviews } from "@/lib/api/hooks";
import type { ReviewDto } from "@/lib/api/types";
import { ReviewAvatar } from "@/components/reviews/ReviewAvatar";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionError } from "@/components/sections/StatsSection";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
  });
}

const defaultTitle = (
  <>
    Bağımsız platformda{" "}
    <span className="text-gradient">5 yıldız</span>
  </>
);

type ReviewsSliderProps = {
  variant?: "slider" | "grid";
  limit?: number;
  showHeading?: boolean;
  eyebrow?: string;
  title?: React.ReactNode;
  description?: string;
  showViewAllLink?: boolean;
};

function ReviewCard({ review }: { review: ReviewDto }) {
  return (
    <article className="flex h-full w-full flex-col rounded-2xl border border-border bg-card p-6">
      <div className="flex shrink-0 items-start gap-3">
        <ReviewAvatar
          author={review.author}
          companyLogoUrl={review.companyLogoUrl}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="text-sm font-semibold leading-tight">{review.author}</p>
            <Badge variant="outline" className="shrink-0 text-[11px] font-normal">
              {review.service}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-4 flex shrink-0 gap-0.5">
        {Array.from({ length: review.rating }).map((_, s) => (
          <Star
            key={s}
            className="h-4 w-4 fill-amber-400 text-amber-400"
          />
        ))}
      </div>

      <p className="mt-4 min-h-0 flex-1 text-sm leading-relaxed text-foreground/90 line-clamp-6">
        “{review.comment}”
      </p>

      <div className="mt-auto shrink-0 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-4">
        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
          <BadgeCheck className="h-3.5 w-3.5 shrink-0" />
          Doğrulanmış Yorum
        </span>
        <Badge variant="success" className="text-[11px]">
          {review.source}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {formatDate(review.date)}
        </span>
      </div>
    </article>
  );
}

export function ReviewsSlider({
  variant = "slider",
  limit,
  showHeading = true,
  eyebrow = "Referanslarımız",
  title = defaultTitle,
  description = "Armut üzerinden hizmet alan müşterilerimizin gerçek, doğrulanmış değerlendirmeleri.",
  showViewAllLink = false,
}: ReviewsSliderProps) {
  const { data, isLoading, isError } = useReviews();
  const reviews = limit ? data?.slice(0, limit) : data;

  return (
    <section className="section-pad">
      <div className="container">
        {showHeading && (
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
        )}

        <div className={showHeading ? "mt-14" : undefined}>
          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: variant === "grid" ? 4 : 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <div className="flex gap-3">
                    <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="mt-4 h-4 w-24" />
                  <Skeleton className="mt-4 h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-5/6" />
                </div>
              ))}
            </div>
          )}
          {isError && <SectionError />}
          {reviews && variant === "grid" && (
            <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {reviews.map((r) => (
                <RevealItem key={r.id}>
                  <ReviewCard review={r} />
                </RevealItem>
              ))}
            </RevealGroup>
          )}
          {reviews && variant === "slider" && (
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="!pb-14 [&_.swiper-wrapper]:items-stretch"
            >
              {reviews.map((r) => (
                <SwiperSlide key={r.id} className="!flex !h-auto">
                  <ReviewCard review={r} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {showViewAllLink && reviews && reviews.length > 0 && (
          <div className="mt-12 flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/basarilarimiz">
                Tüm Referansları Gör
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

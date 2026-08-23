export default function ContactLoading() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="container relative grid items-center gap-8 pt-6 pb-12 sm:gap-10 sm:pt-8 sm:pb-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-12 lg:pt-10 lg:pb-16">
          <div className="space-y-4 text-center lg:text-left">
            <div className="skeleton mx-auto h-6 w-24 rounded-full lg:mx-0" />
            <div className="skeleton mx-auto h-12 w-full max-w-xl lg:mx-0" />
            <div className="skeleton mx-auto h-20 w-full max-w-xl lg:mx-0" />
          </div>
          <div className="skeleton mx-auto aspect-[10/8.5] w-full max-w-[620px] rounded-3xl lg:max-w-[720px]" />
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="container grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div className="skeleton h-[520px] w-full rounded-2xl" />
          <div className="skeleton h-72 w-full rounded-2xl" />
        </div>
      </section>
    </>
  );
}

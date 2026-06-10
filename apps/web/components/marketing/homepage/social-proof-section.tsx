export function SocialProofSection() {
  return (
    <section className="border-b border-border">
      <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
        <div className="border-x border-b md:border-b-0 border-border p-8 text-center first:border-l-0 last:border-r-0 md:first:border-l last:md:border-r">
          <div className="text-3xl font-semibold text-foreground">10K+</div>
          <div className="text-sm text-muted-foreground mt-1">Agents deployed</div>
        </div>
        <div className="border-x border-b md:border-b-0 border-border p-8 text-center first:border-l-0 last:border-r-0 md:first:border-l last:md:border-r">
          <div className="text-3xl font-semibold text-foreground">500K+</div>
          <div className="text-sm text-muted-foreground mt-1">Workflows automated</div>
        </div>
        <div className="border-x border-b md:border-b-0 border-border p-8 text-center first:border-l-0 last:border-r-0 md:first:border-l last:md:border-r">
          <div className="text-3xl font-semibold text-foreground">5K+</div>
          <div className="text-sm text-muted-foreground mt-1">Developers building</div>
        </div>
      </div>
    </section>
  )
}
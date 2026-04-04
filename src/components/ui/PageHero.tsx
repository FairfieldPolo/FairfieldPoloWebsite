interface PageHeroProps {
  title: string
  subtitle?: string
  eyebrow?: string
}

export function PageHero({ title, subtitle, eyebrow }: PageHeroProps) {
  return (
    <div className="bg-polo-green pt-32 pb-14">
      <div className="container-polo">
        {eyebrow && (
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-polo-gold/60" />
            <span className="font-body text-xs uppercase tracking-[0.2em] text-polo-gold">
              {eyebrow}
            </span>
          </div>
        )}
        <h1 className="heading-display text-polo-cream mb-3">{title}</h1>
        {subtitle && (
          <p className="font-body text-polo-cream/70 text-lg max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}

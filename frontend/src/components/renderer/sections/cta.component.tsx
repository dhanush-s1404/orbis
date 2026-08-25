"use client"

interface CTASectionProps {
  id: string
  title: string
  subtitle: string
  primaryCTA: {
    text: string
    href: string
    isExternal?: boolean
  }
  secondaryCTA?: {
    text: string
    href: string
    isExternal?: boolean
  }
  backgroundColor?: string
  backgroundImage?: string
}

export function CTASection({ id, title, subtitle, primaryCTA, secondaryCTA, backgroundColor, backgroundImage }: CTASectionProps) {
  return (
    <section
      id={id}
      className={`relative py-16 px-6 min-h-[400px] flex items-center justify-center ${
        backgroundColor ? `bg-[${backgroundColor}]` : ""
      }`}
    >
      <div className="max-w-3xl text-center px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          {title}
        </h1>
        <p className="text-2xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
          {subtitle}
        </p>

        <div className="flex gap-3">
          <Link
            href={primaryCTA.href}
            className="px-6 py-3 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors"
            onClick={primaryCTA.isExternal ? undefined : (e: React.MouseEvent) => e.preventDefault()}
          >
            {primaryCTA.text}
          </Link>

          {secondaryCTA && (
            <Link
              href={secondaryCTA.href}
              className="px-6 py-3 text-orange-600 font-medium border-2 border-orange-600 rounded-md hover:bg-orange-100 transition-colors"
              onClick={secondaryCTA.isExternal ? undefined : (e: React.MouseEvent) => e.preventDefault()}
            >
              {secondaryCTA.text}
            </Link>
          )}
        </div>
      </div>

      {backgroundImage && (
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />
      )}
    </section>
  )
}
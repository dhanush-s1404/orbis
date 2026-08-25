"use client"

interface HeroSectionProps {
  id: string
  title: string
  subtitle: string
  backgroundImage?: string
  backgroundColor?: string
  primaryCTA?: {
    text: string
    href: string
    isExternal?: boolean
  }
  secondaryCTA?: {
    text: string
    href: string
    isExternal?: boolean
  }
}

export function HeroSection({ id, title, subtitle, backgroundImage, backgroundColor, primaryCTA, secondaryCTA }: HeroSectionProps) {
  return (
    <section
      id={id}
      className="relative min-h-[600px] bg-[{backgroundColor}] flex items-center justify-center px-6 pb-24"
    >
      <div className="max-w-7xl mx-auto text-center px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          {title}
        </h1>
        <p className="text-2xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
          {subtitle}
        </p>

        {primaryCTA && (
          <div className="flex gap-3 mb-6">
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
        )}

        {backgroundImage && (
          <div
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: `url('${backgroundImage}')` }}
          />
        )}
      </div>
    </section>
  )
}
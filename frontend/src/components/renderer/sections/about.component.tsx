"use client"

interface AboutSectionProps {
  id: string
  title: string
  subtitle: string
  description: string
  mission?: string
  values?: string[]
}

export function AboutSection({ id, title, subtitle, description, mission, values }: AboutSectionProps) {
  return (
    <section
      id={id}
      className="py-16 px-6 bg-white dark:bg-zinc-900"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            {title}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            {subtitle}
          </p>
          <p className="text-zinc-500 text-base dark:text-zinc-400 leading-relaxed">
            {description}
          </p>
        </div>

        {mission && (
          <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-xl p-8 max-w-2xl mx-auto mb-12">
            <h3 className="text-xl font-medium text-zinc-800 dark:text-zinc-200 mb-4">
              Our Mission
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              {mission}
            </p>
          </div>
        )}

        {values && values.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-12">
            {values.map((value) => (
              <div
                key={value}
                className="px-4 py-3 bg-zinc-100 dark:bg-zinc-800/30 rounded-xl text-center"
              >
                <div className="text-orange-600 text-2xl mb-2">✓</div>
                <p className="text-zinc-700 dark:text-zinc-300 text-sm">{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
"use client"

interface Feature {
  id: string
  title: string
  description: string
  icon?: string
}

interface FeaturesSectionProps {
  id: string
  title: string
  subtitle: string
  features: Feature[]
  backgroundColor?: string
}

export function FeaturesSection({ id, title, subtitle, features, backgroundColor }: FeaturesSectionProps) {
  return (
    <section
      id={id}
      className="py-16 bg-[{backgroundColor}] px-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            {title}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white dark:bg-zinc-800 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              {feature.icon && (
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor">
                    <path d="M5 5a2 2 0 110-4 2 2 0 010 4z" />
                    <path d="M1 1a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </div>
              )}
              <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
"use client"

interface Service {
  id: string
  title: string
  description: string
  icon?: string
}

interface ServicesSectionProps {
  id: string
  title: string
  subtitle: string
  services: Service[]
}

export function ServicesSection({ id, title, subtitle, services }: ServicesSectionProps) {
  return (
    <section
      id={id}
      className="py-16 px-6 bg-zinc-50 dark:bg-zinc-900"
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white dark:bg-zinc-800 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              {service.icon && (
                <div className="w-10 h-10 rounded bg-orange-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  </svg>
                </div>
              )}
              <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                {service.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
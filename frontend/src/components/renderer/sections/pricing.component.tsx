"use client"

interface PricingPlan {
  id: string
  name: string
  price: string
  billing?: "monthly" | "yearly"
  features: string[]
  popular?: boolean
  callToAction?: {
    text: string
    href: string
    isExternal?: boolean
  }
}

interface PricingSectionProps {
  id: string
  title: string
  subtitle: string
  plans: PricingPlan[]
}

export function PricingSection({ id, title, subtitle, plans }: PricingSectionProps) {
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
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-xl p-6 ${
                plan.popular
                  ? "bg-orange-600/10 border border-orange-600"
                  : "bg-white dark:bg-zinc-800"
              }`}
            >
              <h3 className="text-2xl font-bold ${
                plan.popular ? "text-orange-600 dark:text-orange-400" : "text-zinc-900 dark:text-zinc-100"
              } mb-2">
                {plan.name}
              </h3>
              <p className="text-4xl font-extrabold ${
                plan.popular ? "text-orange-600 dark:text-orange-400" : "text-zinc-900 dark:text-zinc-100"
              } mb-1">${plan.price}</p>
              <p className="text-zinc-500 text-sm ${
                plan.popular ? "text-orange-400 dark:text-orange-200" : "text-zinc-500 dark:text-zinc-400"
              } mb-6">{plan.billing || "per month"}</p>

              <ul className="space-y-2 text-zinc-600 dark:text-zinc-400 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <svg
                      className="w-4 h-4 text-orange-500 flex-shrink-0 mt-1"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.callToAction && (
                <div className="mt-4">
                  <Link
                    href={plan.callToAction.href}
                    className="px-6 py-3 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors"
                    onClick={plan.callToAction.isExternal ? undefined : (e: React.MouseEvent) => e.preventDefault()}
                  >
                    {plan.callToAction.text}
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
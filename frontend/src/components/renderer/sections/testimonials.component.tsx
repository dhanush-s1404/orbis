"use client"

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  company?: string
  avatar?: string
  rating?: number
}

interface TestimonialsSectionProps {
  id: string
  title: string
  subtitle: string
  testimonials: Testimonial[]
}

export function TestimonialsSection({ id, title, subtitle, testimonials }: TestimonialsSectionProps) {
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
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-zinc-50 dark:bg-zinc-800/30 rounded-xl p-6 border border-zinc-200/10"
            >
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed quote">
                {testimonial.content}
              </p>
              <div className="flex items-center gap-3 mt-4">
                {testimonial.avatar && (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {testimonial.name}
                  </p>
                  <p className="text-zinc-500 text-sm dark:text-zinc-400">{testimonial.role}</p>
                </div>
                {testimonial.company && (
                  <p className="text-zinc-500 text-xs dark:text-zinc-400 ml-auto">{testimonial.company}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
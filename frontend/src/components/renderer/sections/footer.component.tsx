"use client"

interface FooterSectionProps {
  id: string
  links?: {
    title: string
    items: { label: string; href: string }[]
  }[]
  copyright: string
  showSocial?: boolean
  socialLinks?: { name: string; href: string }[]
}

export function FooterSection({ id, links, copyright, showSocial, socialLinks }: FooterSectionProps) {
  return (
    <section
      id={id}
      className="py-16 px-6 bg-zinc-900 dark:bg-zinc-900"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {links?.map((linkGroup) => (
            <div key={linkGroup.title} className="text-zinc-200 dark:text-zinc-300">
              <h4 className="font-medium text-zinc-300 dark:text-zinc-400 mb-3">
                {linkGroup.title}
              </h4>
              <ul className="space-y-2">
                {linkGroup.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-zinc-400 dark:text-zinc-400 hover:text-orange-400 transition-colors text-sm"
                      onClick={item.isExternal ? undefined : (e: React.MouseEvent) => e.preventDefault()}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-zinc-800/30">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              {copyright}
            </p>
            {showSocial && socialLinks && socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-zinc-400 dark:text-zinc-400 hover:text-orange-400 transition-colors"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/renderer/sections/navbar.component"
import { HeroSection } from "@/components/renderer/sections/hero.component"
import { FeaturesSection } from "@/components/renderer/sections/features.component"
import { AboutSection } from "@/components/renderer/sections/about.component"
import { ServicesSection } from "@/components/renderer/sections/services.component"
import { TestimonialsSection } from "@/components/renderer/sections/testimonials.component"
import { PricingSection } from "@/components/renderer/sections/pricing.component"
import { CTASection } from "@/components/renderer/sections/cta.component"
import { FooterSection } from "@/components/renderer/sections/footer.component"

type SectionType = 
  | "hero"
  | "features" 
  | "about"
  | "services"
  | "testimonials"
  | "pricing"
  | "cta"
  | "footer"

interface RendererConfig {
  templateId: string
  slug: string
  pages: {
    id: string
    name: string
    sections: {
      id: string
      type: SectionType
      // Content data
      title?: string
      subtitle?: string
      description?: string
      primaryCTA?: { text: string; href: string }
      secondaryCTA?: { text: string; href: string }
      features?: { title: string; description: string; icon?: string }[]
      services?: { title: string; description: string; icon?: string }[]
      testimonials?: { name: string; role: string; content: string; company?: string }[]
      plans?: { name: string; price: string; features: string[] }[]
      ctaTitle?: string
      ctaSubtitle?: string
      primaryCTA?: { text: string; href: string }
      secondaryCTA?: { text: string; href: string }
      backgroundColor?: string
      backgroundImage?: string
      mission?: string
      values?: string[]
      copyright?: string
      navLinks?: { title: string; items: { label: string; href: string }[] }
      showSocial?: boolean
      socialLinks?: { name: string; href: string }[]
    }[]
  }[]
  styles: {
    primaryColor?: string
    secondaryColor?: string
    backgroundColor?: string
    textColor?: string
    fontFamily?: string
    sectionSpacing?: string
    borderRadius?: string
  }
}

interface PublishedWebsiteProps {
  slug: string
  config: RendererConfig
}

export function PublishedWebsite({ slug, config }: PublishedWebsiteProps) {
  const [currentPage, setCurrentPage] = useState(config.pages[0]?.id || config.pages[0]?.name || "")
  const router = useRouter()

  useEffect(() => {
    // Set initial page from URL query param or first page
    const urlParams = new URLSearchParams(window.location.search)
    const urlPage = urlParams.get("page")
    if (urlPage && config.pages.some((p) => p.id === urlPage)) {
      setCurrentPage(urlPage)
    }
  }, [config.pages])

  const handlePageChange = (pageId: string) => {
    setCurrentPage(pageId)
    // Update URL without reloading
    router.replace(`?page=${pageId}`)
  }

  const currentPageConfig = config.pages.find((p) => p.id === currentPage)

  // Page navigation
  const pageNav = currentPageConfig ? (
    <nav className="mb-8">
      <ol className="list-decimal list-inside text-zinc-600 dark:text-zinc-400 space-y-2">
        {config.pages.map((page) => (
          <li key={page.id}>
            <Link
              href={`?page=${page.id}`}
              className={`${
                page.id === currentPage
                  ? "font-bold text-orange-600"
                  : "hover:text-orange-400 transition-colors"
              }`}
              onClick={(e: React.MouseEvent) => {
                e.preventDefault()
                handlePageChange(page.id)
              }}
            >
              {page.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  ) : null

  // Render pages
  if (!currentPageConfig) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Project Not Found
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            The requested page could not be found. Please ensure this project has been published.
          </p>
          <Link
            href="/dashboard/projects"
            className="mt-4 py-2 px-4 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Navbar */}
      <Navbar
        navItems={[
          { id: "home", label: "Home", href: "/", isExternal: false },
          { id: "about", label: "About", href: "?page=about", isExternal: false },
          { id: "services", label: "Services", href: "?page=services", isExternal: false },
          { id: "contact", label: "Contact", href: "?page=contact", isExternal: false },
        ]}
        logo="ORBIS"
        logoHref="/"
      />

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {pageNav}

        {currentPageConfig && currentPageConfig.sections.map((section) => {
          const sectionType = section.type as SectionType

          switch (sectionType) {
            case "hero":
              return <HeroSection
                key={section.id}
                id={section.id}
                title={section.title || "Our Story"}
                subtitle={section.subtitle}
                backgroundImage={section.backgroundImage}
                backgroundColor={section.backgroundColor}
                primaryCTA={section.primaryCTA}
                secondaryCTA={section.secondaryCTA}
              />

            case "features":
              return <FeaturesSection
                key={section.id}
                id={section.id}
                title={section.title || "Features"}
                subtitle={section.subtitle}
                features={section.features || []}
                backgroundColor={section.backgroundColor}
              />

            case "about":
              return <AboutSection
                key={section.id}
                id={section.id}
                title={section.title || "About Us"}
                subtitle={section.subtitle}
                description={section.description}
                mission={section.mission}
                values={section.values}
              />

            case "services":
              return <ServicesSection
                key={section.id}
                id={section.id}
                title={section.title || "Services"}
                subtitle={section.subtitle}
                services={section.services || []}
              />

            case "testimonials":
              return <TestimonialsSection
                key={section.id}
                id={section.id}
                title={section.title || "Testimonials"}
                subtitle={section.subtitle}
                testimonials={section.testimonials || []}
              />

            case "pricing":
              return <PricingSection
                key={section.id}
                id={section.id}
                title={section.title || "Pricing"}
                subtitle={section.subtitle}
                plans={section.plans || []}
              />

            case "cta":
              return <CTASection
                key={section.id}
                id={section.id}
                title={section.ctaTitle || "Get Started"}
                subtitle={section.ctaSubtitle}
                primaryCTA={section.primaryCTA}
                secondaryCTA={section.secondaryCTA}
                backgroundColor={section.backgroundColor}
                backgroundImage={section.backgroundImage}
              />

            case "footer":
              return <FooterSection
                key={section.id}
                id={section.id}
                links={section.navLinks}
                copyright={section.copyright || "© 2026 ORBIS. All rights reserved."}
                showSocial={section.showSocial}
                socialLinks={section.socialLinks}
              />

            default:
              return null
          }
        })}

        {pageNav}
      </main>
    </div>
  )
}
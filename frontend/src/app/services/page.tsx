"use client"

import Link from "next/link"

export default function ServicesPage() {
  const services = [
    {
      id: "1",
      name: "Website Development",
      description:
        "Custom website built from scratch tailored to your business needs. Modern design, responsive layout, and clean code.",
      benefits: [
        "Bespoke design unique to your brand",
        "Fully responsive across all devices",
        "Clean, maintainable codebase",
        "Scalable architecture for future growth",
      ],
    },
    {
      id: "2",
      name: "Website Redesign",
      description:
        "Transform your existing website with a fresh modern look improved user experience and better performance.",
      benefits: [
        "Updated modern design",
        "Improved user navigation",
        "Better performance and speed",
        "Mobile-friendly redesign",
      ],
    },
    {
      id: "3",
      name: "UI/UX Design",
      description:
        "User-centered design focusing on intuitive interfaces and seamless user experiences that drive engagement.",
      benefits: [
        "User research and personas",
        "Wireframes and prototypes",
        "Usability testing",
        "Higher conversion rates",
      ],
    },
    {
      id: "4",
      name: "Ecommerce",
      description:
        "Online store setup with product catalog, shopping cart, payment gateways, and order management systems.",
      benefits: [
        "Product catalog management",
        "Secure payment integration",
        "Order tracking and management",
        "Inventory control",
      ],
    },
    {
      id: "5",
      name: "SEO",
      description:
        "Search engine optimization to improve your website's visibility and ranking on search engines like Google.",
      benefits: [
        "Keyword research and optimization",
        "On-page SEO improvements",
        "Technical SEO audit",
        "Organic traffic growth",
      ],
    },
    {
      id: "6",
      name: "Performance Optimization",
      description:
        "Speed and performance improvements ensuring your website loads fast and provides a smooth browsing experience.",
      benefits: [
        "Image optimization",
        "Code minification",
        "Lazy loading implementation",
        "Caching strategies",
        "Target: <2s load time",
      ],
    },
    {
      id: "7",
      name: "Mobile Optimization",
      description:
        "Ensure your website looks and functions perfectly on all mobile devices and tablets.",
      benefits: [
        "Touch-friendly navigation",
        "Responsive layout adaptation",
        "Mobile performance optimization",
        "Cross-browser compatibility",
      ],
    },
    {
      id: "8",
      name: "Bug Fixing",
      description:
        "Identify and fix technical issues, broken features, and compatibility problems on your existing website.",
      benefits: [
        "Quick issue resolution",
        "Root cause analysis",
        "Preventive measures",
        "Regular maintenance plans",
      ],
    },
    {
      id: "9",
      name: "Custom Features",
      description:
        " bespoke functionality tailored to your specific business requirements, from booking systems to member portals.",
      benefits: [
        "Custom functionality",
        "Integration with third-party services",
        "Unique business processes",
        "Scalable solutions",
      ],
    },
    {
      id: "10",
      name: "Maintenance",
      description:
        "Ongoing maintenance and support to keep your website secure, up-to-date, and performing at its best.",
      benefits: [
        "Regular security updates",
        "Content updates",
        "Performance monitoring",
        "24/7 support option",
      ],
    },
  ]

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 mb-6 dark:text-zinc-100">
            Orbis Services
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Professional web solutions for your business growth.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-bg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-orange-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 3l2.11 2.11a1 1 0 0 1 1.42 0l1.42-1.42a1 1 0 0 1 1.42 1.43L4.83 12l4.58 2.68a1 1 0 0 1 0 1.74L9.67 15.02a1 1 0 0 1-1.42 0l-1.42-1.42A1 1 0 0 1 6.83 12L2 22l10-10-5-5z"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2 dark:text-zinc-100">
                    {service.name}
                  </h3>
                  <p className="text-zinc-500 text-sm dark:text-zinc-400 line-clamp-2">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-zinc-600 text-sm dark:text-zinc-400">
                {service.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start">
                    <svg
                      className="w-3.5 h-3.5 flex-shrink-0 text-orange-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 13h14M5 13a2 2 0 0 0 2 2v1a2 2 0 0 0 2-2V13"></path>
                    </svg>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
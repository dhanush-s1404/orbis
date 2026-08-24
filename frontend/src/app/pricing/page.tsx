"use client"

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-zinc-900 mb-6 dark:text-zinc-100">
            Orbis Pricing
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Professional pricing plans for every business need.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Starter Plan */}
          <div
            className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-lg border border-zinc-200/50"
          >
            <div className="mb-6">
              <span className="text-orange-600 text-xl font-bold">Starter</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-1 dark:text-zinc-100">
              Simple Website
            </h2>
            <p className="text-zinc-500 mb-8">Perfect for personal projects and portfolios</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <span>₹9,999</span>
              <span>/mo</span>
            </div>
            <ul className="space-y-3 mb-8 text-zinc-600 dark:text-zinc-400">
              <li>• 5 Pages</li>
              <li>• Responsive Design</li>
              <li>• Basic SEO</li>
              <li>• Contact Form</li>
            </ul>
            <button
              className="w-full py-3 px-4 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors"
            >
              Start Now
            </button>
          </div>

          {/* Business Plan */}
          <div
            className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-lg border border-zinc-200/50 bg-orange-50/50"
          >
            <div className="mb-6">
              <span className="text-orange-600 text-xl font-bold">Business</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-1 dark:text-zinc-100">
              Business Website
            </h2>
            <p className="text-zinc-500 mb-8">Professional business presence</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <span>₹19,999</span>
              <span>/mo</span>
            </div>
            <ul className="space-y-3 mb-8 text-zinc-600 dark:text-zinc-400">
              <li>• 10 Pages</li>
              <li>• CMS Integration</li>
              <li>• Full SEO</li>
              <li>• Gallery</li>
              <li>• Analytics</li>
            </ul>
            <button
              className="w-full py-3 px-4 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors"
            >
              Get Started
            </button>
          </div>

          {/* Ecommerce Plan */}
          <div
            className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-lg border border-zinc-200/50"
          >
            <div className="mb-6">
              <span className="text-orange-600 text-xl font-bold">Ecommerce</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-1 dark:text-zinc-100">
              Online Store
            </h2>
            <p className="text-zinc-500 mb-8">Sell products online</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <span>₹39,999</span>
              <span>/mo</span>
            </div>
            <ul className="space-y-3 mb-8 text-zinc-600 dark:text-zinc-400">
              <li>• Unlimited Products</li>
              <li>• Payment Gateway</li>
              <li>• Order Management</li>
              <li>• Inventory Tracking</li>
              <li>• Analytics</li>
            </ul>
            <button
              className="w-full py-3 px-4 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors"
            >
              Open Store
            </button>
          </div>
        </div>

        <div className="mt-12 pt-12 border-t border-zinc-200/50 text-center">
          <p className="text-zinc-500 mb-4">
            Need something custom? <a href "/contact" className="text-orange-600 font-medium hover:underline">
              Request Custom Quote
            </a>
          </p>
          <p className="text-zinc-500 text-sm">
            All plans include responsive design and basic SEO optimization.
          </p>
        </div>
      </div>
    </main>
  )
}
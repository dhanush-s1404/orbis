"use client"

import { useState } from "react"
import Link from "next/link"

interface BuildStep {
  step: number
  title: string
  description: string
  completed: boolean
}

export default function BuildPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<{
    category?: string
    businessName?: string
    businessDescription?: string
    targetAudience?: string
    requiredPages?: string
    requiredFeatures?: string
    designPreferences?: string
    budget?: string
    timeline?: string
  }>({})

  const steps: BuildStep[] = [
    {
      step: 1,
      title: "What are you building?",
      description: "Select your website category",
      completed: step > 1,
    },
    {
      step: 2,
      title: "Tell us about your business",
      description: "Share business details",
      completed: step > 2,
    },
    {
      step: 3,
      title: "What does your website need?",
      description: "Select features and style",
      completed: step > 3,
    },
    {
      step: 4,
      title: "Choose your style and budget",
      description: "Budget and timeline",
      completed: step > 4,
    },
    {
      step: 5,
      title: "Submit Requirements",
      description: "Final submission",
      completed: step >= 5,
    },
  ]

  const handleNext = () => setStep((s) => s + 1)
  const handlePrev = () => setStep((s) => s - 1)
  const handleSubmit = () => {
    // Submit form data to backend
    console.log("Submitting build requirements:", formData)
    alert("Requirements submitted successfully!")
  }

  return (
    <main className="flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      <div className="w-full max-w-4xl space-y-8 px-6 py-12">
        {/* Stepper */}
        <div className="flex justify-between mb-8">
          {steps.map((s) => (
            <div
              key={s.step}
              className={`flex flex-col items-center ${step >= s.step ? "text-orange-600" : "text-zinc-400"} ${step >= s.step ? "font-medium" : "font-normal"}`}
            >
              <svg
                className={`w-8 h-8 ${step >= s.step ? "text-orange-600 fill-orange-600" : "stroke-zinc-300"} ${step > s.step ? "fill-orange-600" : "stroke-zinc-300"}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83m5.66 5.66l2.83 2.83M1 12h4M18 12h4M9 19v4M9 5v4"></path>
              </svg>
              <span className="mt-2 text-xs">{s.title}</span>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-orange-100 dark:bg-orange-900 rounded-full w-full mx-auto mb-8">
          <div
            className="h-full bg-orange-600 rounded-full transition-width"
            style={{ width: `${(step / steps.length) * 100}%` }}
          ></div>
        </div>

        {/* Current Step Content */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-lg">
          {step === 1 ? (
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">What are you building?</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-zinc-700 text-sm mb-2">
                    <input
                      type="radio"
                      name="category"
                      value="business"
                      checked={formData.category !== "ecommerce"}
                      onChange={(e) => setFormData({ ...formData, category: "business" })}
                      className="w-4 h-4 rounded border-zinc-300 focus:ring-orange-600"
                    /> Business
                  </label>
                </div>
                <div>
                  <label className="block text-zinc-700 text-sm mb-2">
                    <input
                      type="radio"
                      name="category"
                      value="ecommerce"
                      checked={formData.category === "ecommerce"}
                      onChange={(e) => setFormData({ ...formData, category: "ecommerce" })}
                      className="w-4 h-4 rounded border-zinc-300 focus:ring-orange-600"
                    /> E-commerce
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-zinc-700 text-sm mb-2">
                    <input
                      type="radio"
                      name="category"
                      value="portfolio"
                      checked={formData.category === "portfolio"}
                      onChange={(e) => setFormData({ ...formData, category: "portfolio" })}
                      className="w-4 h-4 rounded border-zinc-300 focus:ring-orange-600"
                    /> Portfolio
                  </label>
                </div>
                <div>
                  <label className="block text-zinc-700 text-sm mb-2">
                    <input
                      type="radio"
                      name="category"
                      value="startup"
                      checked={formData.category === "startup"}
                      onChange={(e) => setFormData({ ...formData, category: "startup" })}
                      className="w-4 h-4 rounded border-zinc-300 focus:ring-orange-600"
                    /> Startup
                  </label>
                </div>
              </div>
              <button
                onClick={handleNext}
                className="w-full py-3 px-4 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors mt-4"
              >
                Continue
              </button>
            </div>
          ) : step === 2 ? (
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">Tell us about your business</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-zinc-700 text-sm mb-2">
                    Business Name
                    <span className="text-zinc-500">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.businessName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, businessName: e.target.value })
                    }
                    placeholder="e.g., Acme Corp"
                    className="w-full px-3 py-2 border border-zinc-300 rounded focus:ring-orange-600 focus:border-orange-600"
                  />
                </div>
                <div>
                  <label className="block text-zinc-700 text-sm mb-2">
                    Business Description
                  </label>
                  <textarea
                    value={formData.businessDescription || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, businessDescription: e.target.value })
                    }
                    placeholder="Describe your business, what you do, your industry..."
                    rows={3}
                    className="w-full px-3 py-2 border border-zinc-300 rounded focus:ring-orange-600 focus:border-orange-600"
                  />
                </div>
                <div>
                  <label className="block text-zinc-700 text-sm mb-2">
                    Target Audience
                  </label>
                  <textarea
                    value={formData.targetAudience || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, targetAudience: e.target.value })
                    }
                    placeholder="Who is your website for? (e.g., young professionals, home owners, etc.)"
                    rows={3}
                    className="w-full px-3 py-2 border border-zinc-300 rounded focus:ring-orange-600 focus:border-orange-600"
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <button onClick={handlePrev} className="py-2 px-4 border border-zinc-300 rounded hover:bg-zinc-50 transition-colors">
                  Previous
                </button>
                <button onClick={handleNext} className="py-2 px-4 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors">
                  Continue
                </button>
              </div>
            </div>
          ) : step === 3 ? (
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">What does your website need?</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-zinc-700 text-sm mb-2">
                    Required Pages
                  </label>
                  <select
                    value={formData.requiredPages || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, requiredPages: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-zinc-300 rounded focus:ring-orange-600 focus:border-orange-600"
                  >
                    <option value="">Select pages</option>
                    <option value="home">Home page</option>
                    <option value="about">About page</option>
                    <option value="products">Products/services page</option>
                    <option value="contact">Contact page</option>
                    <option value="booking">Booking system</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-700 text-sm mb-2">
                    Required Features
                  </label>
                  <select
                    value={formData.requiredFeatures || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, requiredFeatures: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-zinc-300 rounded focus:ring-orange-600 focus:border-orange-600"
                  >
                    <option value="">Select features</option>
                    <option value="responsive">Responsive design</option>
                    <option value="cms">CMS integration</option>
                    <option value="payment">Payment gateway</option>
                    <option value="booking">Booking system</option>
                    <option value="blog">Blog</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-zinc-700 text-sm mb-2">
                    Design Preferences
                  </label>
                  <textarea
                    value={formData.designPreferences || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, designPreferences: e.target.value })
                    }
                    placeholder="Modern, minimal, luxury, playful, technical, etc."
                    rows={2}
                    className="w-full px-3 py-2 border border-zinc-300 rounded focus:ring-orange-600 focus:border-orange-600"
                  />
                </div>
                <div>
                  <label className="block text-zinc-700 text-sm mb-2">
                    Timeline
                  </label>
                  <select
                    value={formData.timeline || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, timeline: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-zinc-300 rounded focus:ring-orange-600 focus:border-orange-600"
                  >
                    <option value="">Select timeline</option>
                    <option value="1-2-weeks">1-2 weeks</option>
                    <option value="1-month">1 month</option>
                    <option value="2-3-months">2-3 months</option>
                    <option value="6-months+">6 months+</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between">
                <button onClick={handlePrev} className="py-2 px-4 border border-zinc-300 rounded hover:bg-zinc-50 transition-colors">
                  Previous
                </button>
                <button onClick={handleNext} className="py-2 px-4 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors">
                  Continue
                </button>
              </div>
            </div>
          ) : step === 4 ? (
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">Choose your style and budget</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-zinc-700 text-sm mb-2">
                    Budget
                  </label>
                  <select
                    value={formData.budget || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-zinc-300 rounded focus:ring-orange-600 focus:border-orange-600"
                  >
                    <option value="">Select budget</option>
                    <option value="under-10k">Under ₹10,000</option>
                    <option value="10k-20k">₹10,000 - ₹20,000</option>
                    <option value="20k-50k">₹20,000 - ₹50,000</option>
                    <option value="50k-1lakh">₹50,000 - ₹1,00,000</option>
                    <option value="1lac+">₹1,00,000+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-700 text-sm mb-2">
                    Preferred Style
                  </label>
                  <select
                    value={formData.designPreferences || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, designPreferences: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-zinc-300 rounded focus:ring-orange-600 focus:border-orange-600"
                  >
                    <option value="">Select style</option>
                    <option value="modern">Modern</option>
                    <option value="minimal">Minimal</option>
                    <option value="luxury">Luxury</option>
                    <option value="creative">Creative</option>
                    <option value="technical">Technical</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between">
                <button onClick={handlePrev} className="py-2 px-4 border border-zinc-300 rounded hover:bg-zinc-50 transition-colors">
                  Previous
                </button>
                <button onClick={handleSubmit} className="py-2 px-4 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors">
                  Submit Requirements
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">Requirements Submitted</h2>
              <p className="text-zinc-600 mb-6">
                Thank you! Your requirements have been submitted successfully. Our team will review your needs and contact you shortly to discuss your project.
              </p>
              <div className="text-center">
                <p className="text-zinc-500 text-sm mb-4">Project ID: ORBIS-BUILD-{Math.floor(
                  1000 + Math.random() * 9000
                )}</p>
                <button
                  onClick={() => setStep(1)}
                  className="py-3 px-6 bg-zinc-900 text-white font-medium rounded-md hover:bg-zinc-800 transition-colors"
                >
                  Start a New Project
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
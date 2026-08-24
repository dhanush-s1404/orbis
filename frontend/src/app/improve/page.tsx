"use client"

import { useState } from "react"
import Link from "next/link"

export default function ImprovePage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<{
    websiteUrl?: string
    improvementAreas?: string
    additionalNotes?: string
  }>({})

  const steps = [
    {
      step: 1,
      title: "Your website can be better.",
      description: "Enter your website URL to get started",
      completed: step > 1,
    },
    {
      step: 2,
      title: "What would you like to improve?",
      description: "Select improvement areas",
      completed: step > 2,
    },
    {
      step: 3,
      title: "Describe what you want changed",
      description: "Details about your improvements",
      completed: step > 3,
    },
    {
      step: 4,
      title: "Request Improvement",
      description: "Submit your improvement request",
      completed: step >= 4,
    },
  ]

  const handleNext = () => setStep((s) => s + 1)
  const handlePrev = () => setStep((s) => s - 1)
  const handleSubmit = () => {
    console.log("Submitting improvement request:", formData)
    alert("Improvement request submitted successfully!")
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
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">
                Your website can be better.
              </h2>
              <p className="text-zinc-600 mb-8 max-w-xl">
                Enter your website URL below and we'll analyze how to improve it.
              </p>
              <div className="mb-6">
                <input
                  type="text"
                  value={formData.websiteUrl || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, websiteUrl: e.target.value })
                  }
                  placeholder="https://www.example.com"
                  className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                  aria-label="Website URL"
                />
                <button
                  onClick={handleNext}
                  className="mt-4 w-full py-3 px-4 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : step === 2 ? (
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">
                What would you like to improve?
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block zinnk-700 text-sm font-medium mb-2">
                    <input
                      type="checkbox"
                      checked={formData.improvementAreas?.includes("design")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          improvementAreas:
                            e.target.checked
                              ? [...(formData.improvementAreas || []), "design"]
                              : formData.improvementAreas?.filter(
                                  (a) => a !== "design"
                                ),
                        })
                      }
                      className="w-4 h-4 rounded border-zinc-300 focus:ring-orange-600"
                    />
                    Design
                  </label>
                </div>
                <div>
                  <label className="block text-zinc-700 text-sm font-medium mb-2">
                    <input
                      type="checkbox"
                      checked={formData.improvementAreas?.includes("speed")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          improvementAreas:
                            e.target.checked
                              ? [...(formData.improvementAreas || []), "speed"]
                              : formData.improvementAreas?.filter(
                                  (a) => a !== "speed"
                                ),
                        })
                      }
                      className="w-4 h-4 rounded border-zinc-300 focus:ring-orange-600"
                    />
                    Speed
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-zinc-700 text-sm font-medium mb-2">
                    <input
                      type="checkbox"
                      checked={formData.improvementAreas?.includes("mobile")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          improvementAreas:
                            e.target.checked
                              ? [...(formData.improvementAreas || []), "mobile"]
                              : formData.improvementAreas?.filter(
                                  (a) => a !== "mobile"
                                ),
                        })
                      }
                      className="w-4 h-4 rounded border-zinc-300 focus:ring-orange-600"
                    />
                    Mobile
                  </label>
                </div>
                <div>
                  <label className="block text-zinc-700 text-sm font-medium mb-2">
                    <input
                      type="checkbox"
                      checked={formData.improvementAreas?.includes("seo")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          improvementAreas:
                            e.target.checked
                              ? [...(formData.improvementAreas || []), "seo"]
                              : formData.improvementAreas?.filter(
                                  (a) => a !== "seo"
                                ),
                        })
                      }
                      className="w-4 h-4 rounded border-zinc-300 focus:ring-orange-600"
                    />
                    SEO
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-zinc-700 text-sm font-medium mb-2">
                    <input
                      type="checkbox"
                      checked={formData.improvementAreas?.includes("conversion")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          improvementAreas:
                            e.target.checked
                              ? [...(formData.improvementAreas || []), "conversion"]
                              : formData.improvementAreas?.filter(
                                  (a) => a !== "conversion"
                                ),
                        })
                      }
                      className="w-4 h-4 rounded border-zinc-300 focus:ring-orange-600"
                    />
                    Conversion
                  </label>
                </div>
                <div>
                  <label className="block text-zinc-700 text-sm font-medium mb-2">
                    <input
                      type="checkbox"
                      checked={formData.improvementAreas?.includes("accessibility")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          improvementAreas:
                            e.target.checked
                              ? [...(formData.improvementAreas || []), "accessibility"]
                              : formData.improvementAreas?.filter(
                                  (a) => a !== "accessibility"
                                ),
                        })
                      }
                      className="w-4 h-4 rounded border-zinc-300 focus:ring-orange-600"
                    />
                    Accessibility
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-zinc-700 text-sm font-medium mb-2">
                    <input
                      type="checkbox"
                      checked={formData.improvementAreas?.includes("bugs")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          improvementAreas:
                            e.target.checked
                              ? [...(formData.improvementAreas || []), "bugs"]
                              : formData.improvementAreas?.filter(
                                  (a) => a !== "bugs"
                                ),
                        })
                      }
                      className="w-4 h-4 rounded border-zinc-300 focus:ring-orange-600"
                    />
                    Bugs
                  </label>
                </div>
                <div>
                  <label className="block text-zinc-700 text-sm font-medium mb-2">
                    <input
                      type="checkbox"
                      checked={formData.improvementAreas?.includes("features")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          improvementAreas:
                            e.target.checked
                              ? [...(formData.improvementAreas || []), "features"]
                              : formData.improvementAreas?.filter(
                                  (a) => a !== "features"
                                ),
                        })
                      }
                      className="w-4 h-4 rounded border-zinc-300 focus:ring-orange-600"
                    />
                    Features
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-zinc-700 text-sm font-medium mb-2">
                    <input
                      type="checkbox"
                      checked={formData.improvementAreas?.includes("security")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          improvementAreas:
                            e.target.checked
                              ? [...(formData.improvementAreas || []), "security"]
                              : formData.improvementAreas?.filter(
                                  (a) => a !== "security"
                                ),
                        })
                      }
                      className="w-4 h-4 rounded border-zinc-300 focus:ring-orange-600"
                    />
                    Security
                  </label>
                </div>
                <div>
                  <label className="block text-zinc-700 text-sm font-medium mb-2">
                    <input
                      type="checkbox"
                      checked={formData.improvementAreas?.includes("redesign")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          improvementAreas:
                            e.target.checked
                              ? [...(formData.improvementAreas || []), "redesign"]
                              : formData.improvementAreas?.filter(
                                  (a) => a !== "redesign"
                                ),
                        })
                      }
                      className="w-4 h-4 rounded border-zinc-300 focus:ring-orange-600"
                    />
                    Complete Redesign
                  </label>
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
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">
                Describe what you want changed.
              </h2>
              <div className="space-y-4">
                <textarea
                  value={formData.additionalNotes || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, additionalNotes: e.target.value })
                  }
                  placeholder="Describe specific improvements you want... (design changes, features to add, pages to improve, etc.)"
                  rows={4}
                  className="w-full px-3 py-2 border border-zinc-300 rounded focus:ring-orange-600 focus:border-orange-600"
                  aria-label="Improvement details"
                />
              </div>
              <div className="flex justify-between">
                <button onClick={handlePrev} className="py-2 px-4 border border-zinc-300 rounded hover:bg-zinc-50 transition-colors">
                  Previous
                </button>
                <button onClick={handleNext} className="py-2 px-4 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-500 transition-colors">
                  Request Improvement
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">Improvement Requested</h2>
              <p className="text-zinc-600 mb-6">
                Your improvement request has been submitted successfully. Our team will analyze your website and provide recommendations for enhancement.
              </p>
              <div className="text-center">
                <p className="text-zinc-500 text-sm mb-4">
                  Request ID: ORBIS-IMPROVE-{Math.floor(1000 + Math.random() * 9000)}
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="py-3 px-6 bg-zinc-900 text-white font-medium rounded-md hover:bg-zinc-800 transition-colors"
                >
                  Start New Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
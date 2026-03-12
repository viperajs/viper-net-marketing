"use client"

import { useState, useEffect, useRef } from "react"
import { Star, Send, Loader2 } from "lucide-react"
import { toast } from "sonner"

function StarRating({ rating, onRate, interactive = false, size = "w-5 h-5" }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} transition-colors ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-white/20"
          } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
          onClick={() => interactive && onRate?.(star)}
        />
      ))}
    </div>
  )
}

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", rating: 5, message: "" })
  const [sending, setSending] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews")
        if (res.ok) {
          const data = await res.json()
          setReviews(data)
        }
      } catch {
        // silently fail
      }
      setLoading(false)
    }
    fetchReviews()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error("Failed to send")
      setFormData({ name: "", email: "", rating: 5, message: "" })
      toast.success("Review submitted! It will appear after approval.")
    } catch {
      toast.error("Failed to submit review. Please try again.")
    }
    setSending(false)
  }

  return (
    <section id="reviews" ref={sectionRef} className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Client Reviews
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            See what our clients say about working with us
          </p>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
          </div>
        ) : reviews.length > 0 ? (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-500 hover:bg-white/[0.08] hover:border-white/20"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <StarRating rating={review.rating} size="w-4 h-4" />
                <p className="text-white/70 text-sm mt-4 mb-4 line-clamp-4">
                  &ldquo;{review.message}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-sm font-medium">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{review.name}</p>
                    <p className="text-white/30 text-xs">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mb-16">
            <p className="text-white/30 text-sm">No reviews yet. Be the first to leave one!</p>
          </div>
        )}

        {/* Submit Review Form */}
        <div className={`max-w-xl mx-auto transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-white mb-6">Leave a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Name *"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email (optional)"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <div>
                <label className="text-white/50 text-sm mb-2 block">Rating</label>
                <StarRating
                  rating={formData.rating}
                  onRate={(r) => setFormData({ ...formData, rating: r })}
                  interactive
                />
              </div>
              <div>
                <textarea
                  placeholder="Your review *"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30 transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-50"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Review
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

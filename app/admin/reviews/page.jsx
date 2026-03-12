"use client"

import { useState, useEffect } from "react"
import { Star, Trash2, Check, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchReviews = async () => {
    const res = await fetch("/api/admin/reviews")
    if (res.ok) {
      const data = await res.json()
      setReviews(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const toggleApproval = async (id, currentApproved) => {
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: !currentApproved }),
    })
    if (res.ok) {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, approved: !currentApproved } : r))
      )
      toast.success(currentApproved ? "Review hidden" : "Review approved")
    }
  }

  const deleteReview = async (id) => {
    if (!confirm("Delete this review?")) return
    const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" })
    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r.id !== id))
      toast.success("Review deleted")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
      </div>
    )
  }

  const pendingCount = reviews.filter((r) => !r.approved).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Reviews</h1>
        <span className="text-white/40 text-sm">
          {pendingCount} pending
        </span>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className={`rounded-xl border transition-colors ${
                review.approved
                  ? "bg-white/[0.02] border-white/5"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-white font-medium text-sm">
                        {review.name}
                      </span>
                      {review.email && (
                        <span className="text-white/30 text-xs truncate">
                          {review.email}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        review.approved
                          ? "bg-green-400/10 text-green-400"
                          : "bg-yellow-400/10 text-yellow-400"
                      }`}>
                        {review.approved ? "Approved" : "Pending"}
                      </span>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-white/20"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-white/60 text-sm">
                      {review.message}
                    </p>
                  </div>
                  <span className="text-white/20 text-xs flex-shrink-0">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-4 text-xs">
                  <button
                    onClick={() => toggleApproval(review.id, review.approved)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                      review.approved
                        ? "bg-white/5 text-yellow-400/60 hover:text-yellow-400 hover:bg-yellow-400/5"
                        : "bg-white/5 text-green-400/60 hover:text-green-400 hover:bg-green-400/5"
                    }`}
                  >
                    {review.approved ? (
                      <>
                        <X className="w-3.5 h-3.5" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Approve
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-colors ml-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

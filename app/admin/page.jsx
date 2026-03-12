"use client"

import { useState, useEffect } from "react"
import { Mail, Trash2, Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  const fetchInquiries = async () => {
    const res = await fetch("/api/admin/inquiries")
    if (res.ok) {
      const data = await res.json()
      setInquiries(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchInquiries()
  }, [])

  const toggleRead = async (id, currentRead) => {
    await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !currentRead }),
    })
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, read: !currentRead } : i))
    )
  }

  const deleteInquiry = async (id) => {
    if (!confirm("Delete this inquiry?")) return
    const res = await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" })
    if (res.ok) {
      setInquiries((prev) => prev.filter((i) => i.id !== id))
      toast.success("Inquiry deleted")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Inquiries</h1>
        <span className="text-white/40 text-sm">
          {inquiries.filter((i) => !i.read).length} unread
        </span>
      </div>

      {inquiries.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No inquiries yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className={`rounded-xl border transition-colors ${
                inquiry.read
                  ? "bg-white/[0.02] border-white/5"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <div
                className="flex items-center gap-4 p-4 cursor-pointer"
                onClick={() => setExpandedId(expandedId === inquiry.id ? null : inquiry.id)}
              >
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    inquiry.read ? "bg-white/20" : "bg-blue-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm truncate">
                      {inquiry.name}
                    </span>
                    <span className="text-white/30 text-xs truncate">
                      {inquiry.email}
                    </span>
                  </div>
                  <p className="text-white/40 text-xs mt-0.5 truncate">
                    {inquiry.message}
                  </p>
                </div>
                <span className="text-white/20 text-xs flex-shrink-0">
                  {new Date(inquiry.created_at).toLocaleDateString()}
                </span>
              </div>

              {expandedId === inquiry.id && (
                <div className="px-4 pb-4 border-t border-white/5 pt-3">
                  <p className="text-white/70 text-sm whitespace-pre-wrap mb-4">
                    {inquiry.message}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Reply
                    </a>
                    <button
                      onClick={() => toggleRead(inquiry.id, inquiry.read)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      {inquiry.read ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          Mark unread
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          Mark read
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => deleteInquiry(inquiry.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-colors ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

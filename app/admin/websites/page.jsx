"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, ExternalLink, Loader2, Globe } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function AdminWebsites() {
  const [websites, setWebsites] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchWebsites = async () => {
    const res = await fetch("/api/admin/websites")
    if (res.ok) {
      const data = await res.json()
      setWebsites(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchWebsites()
  }, [])

  const deleteWebsite = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return
    const res = await fetch(`/api/admin/websites/${id}`, { method: "DELETE" })
    if (res.ok) {
      setWebsites((prev) => prev.filter((w) => w.id !== id))
      toast.success("Website deleted")
    } else {
      toast.error("Failed to delete")
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
        <h1 className="text-2xl font-bold text-white">Websites</h1>
        <Link
          href="/admin/websites/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Website
        </Link>
      </div>

      {websites.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No websites added yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {websites.map((website) => (
            <div
              key={website.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors"
            >
              {/* Logo */}
              <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                {website.logo_path ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/logos/${website.logo_path}`}
                    alt={website.name}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <Globe className="w-5 h-5 text-white/30" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-sm">{website.name}</span>
                  <span className="text-white/30 text-xs">{website.category}</span>
                </div>
                <a
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/30 text-xs hover:text-white/60 transition-colors flex items-center gap-1"
                >
                  {website.url}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Rating */}
              <span className="text-white/40 text-sm flex-shrink-0">
                {"★".repeat(website.rating)}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Link
                  href={`/admin/websites/${website.id}/edit`}
                  className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => deleteWebsite(website.id, website.name)}
                  className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

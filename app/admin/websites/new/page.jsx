"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function NewWebsite() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [form, setForm] = useState({
    name: "",
    original_name: "",
    url: "",
    category: "",
    rating: 5,
    review: "",
    sort_order: 0,
  })

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      let logo_path = null

      // Upload logo if provided
      if (logoFile) {
        const formData = new FormData()
        formData.append("file", logoFile)
        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        })
        if (uploadRes.ok) {
          const { path } = await uploadRes.json()
          logo_path = path
        }
      }

      const res = await fetch("/api/admin/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, logo_path }),
      })

      if (!res.ok) throw new Error("Failed to create")

      toast.success("Website added")
      router.push("/admin/websites")
    } catch (err) {
      toast.error("Failed to save website")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/websites"
        className="flex items-center gap-2 text-white/40 text-sm hover:text-white/70 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Websites
      </Link>

      <h1 className="text-2xl font-bold text-white mb-6">Add Website</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/50 text-xs mb-1.5">Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
              placeholder="AVERA Wood Materials"
            />
          </div>
          <div>
            <label className="block text-white/50 text-xs mb-1.5">Original Name</label>
            <input
              type="text"
              value={form.original_name}
              onChange={(e) => setForm({ ...form, original_name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
              placeholder="АВЕРА ЕООД"
            />
          </div>
        </div>

        <div>
          <label className="block text-white/50 text-xs mb-1.5">URL *</label>
          <input
            type="url"
            required
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
            placeholder="https://example.com"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-white/50 text-xs mb-1.5">Category</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
              placeholder="E-commerce"
            />
          </div>
          <div>
            <label className="block text-white/50 text-xs mb-1.5">Rating (1-5)</label>
            <select
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n} className="bg-[#111]">
                  {"★".repeat(n)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-white/50 text-xs mb-1.5">Sort Order</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-white/50 text-xs mb-1.5">Review / Description</label>
          <textarea
            rows={4}
            value={form.review}
            onChange={(e) => setForm({ ...form, review: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
            placeholder="Write a review or description..."
          />
        </div>

        <div>
          <label className="block text-white/50 text-xs mb-1.5">Logo</label>
          <div className="flex items-center gap-4">
            {logoPreview && (
              <img src={logoPreview} alt="Preview" className="w-12 h-12 object-contain rounded-lg bg-white/5 border border-white/10 p-1" />
            )}
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/50 text-sm cursor-pointer hover:bg-white/10 hover:text-white/70 transition-colors">
              <Upload className="w-4 h-4" />
              {logoFile ? logoFile.name : "Choose file"}
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {saving ? "Saving..." : "Add Website"}
        </button>
      </form>
    </div>
  )
}

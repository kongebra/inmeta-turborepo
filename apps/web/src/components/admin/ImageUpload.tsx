// src/components/admin/ImageUpload.tsx
import { useState, useRef } from 'react'
import { Button } from '~/components/nidaros/Button'

interface ImageUploadProps {
  gameId: string
  onUploaded: (url: string) => void
}

export function ImageUpload({ gameId, onUploaded }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    const fd = new FormData()
    fd.append('file', file)
    fd.append('gameId', gameId)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })

      if (!res.ok) {
        setError(await res.text())
        return
      }

      const { url } = await res.json()
      onUploaded(url)
      if (inputRef.current) inputRef.current.value = ''
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Opplasting feilet')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleFileChange}
        className="hidden"
        id="img-upload"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? 'Laster opp...' : 'Last opp bilde'}
      </Button>
      {error && <span className="text-[var(--warn)] text-sm">{error}</span>}
    </div>
  )
}

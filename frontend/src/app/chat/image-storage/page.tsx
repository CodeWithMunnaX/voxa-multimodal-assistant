"use client"

import { useState, useEffect, useRef } from "react"
import { Image as ImageIcon, UploadCloud, Sparkles, Loader2, Download, Trash2, Maximize2 } from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Document {
  id: string
  filename: string
  file_size: number | null
  file_type: string | null
  cloudinary_url: string | null
  cloudinary_public_id: string | null
  created_at: string
}

export default function ImageStoragePage() {
  const [images, setImages] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      setIsLoading(true)
      const res = await api.get<any[]>("/documents")
      const data = Array.isArray(res) ? res : (res as any).data
      if (data && Array.isArray(data)) {
        // Filter only images (either by file_type or checking if it's an image extension in cloudinary_url)
        const imageDocs = data.filter(doc => 
          (doc.file_type && doc.file_type.includes("image")) || 
          (doc.cloudinary_url && doc.cloudinary_url.match(/\.(jpeg|jpg|gif|png|webp)$/i))
        )
        setImages(imageDocs)
      }
    } catch (e) {
      console.error("Failed to load images", e)
      toast.error("Failed to load your images.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.includes("image")) {
      toast.error("Please select an image file.")
      return
    }

    setIsUploading(true)
    const toastId = toast.loading("Uploading image to Cloudinary...")

    try {
      // 1. Upload to Cloudinary via /api/media/upload
      const formData = new FormData()
      formData.append("file", file)
      
      const mediaRes = await api.post("/media/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      const cloudinaryUrl = (mediaRes as any).url || (mediaRes as any).data?.url

      if (!cloudinaryUrl) {
        throw new Error("Failed to get Cloudinary URL")
      }

      // 2. Save as Document via /api/documents
      await api.post("/documents", {
        filename: file.name,
        file_type: file.type,
        file_size: file.size,
        cloudinary_url: cloudinaryUrl
      })

      toast.success("Image uploaded successfully!", { id: toastId })
      
      // Refresh gallery
      await fetchImages()
      
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload image. Please try again.", { id: toastId })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = "" // Reset input
      }
    }
  }

  return (
    <div className="flex flex-col min-h-full bg-transparent text-foreground font-sans relative">
      <main className="flex-1 p-8 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-none bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-[0_4px_24px_-8px_rgba(16,185,129,0.25)]">
                <ImageIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
                  Image Storage <Sparkles className="h-5 w-5 text-emerald-500" />
                </h1>
                <p className="text-muted-foreground text-sm mt-1">Securely store and manage your images in the cloud.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              <Button 
                onClick={handleUploadClick}
                disabled={isUploading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-none h-12 px-6 font-bold shadow-md shadow-emerald-500/20 transition-all"
              >
                {isUploading ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Uploading...</>
                ) : (
                  <><UploadCloud className="w-5 h-5 mr-2" /> Upload Image</>
                )}
              </Button>
            </div>
          </div>

          {/* Gallery */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-600" />
              <p className="text-lg">Loading your gallery...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-card border border-border rounded-none shadow-sm">
              <ImageIcon className="w-16 h-16 mb-4 text-muted-foreground/60" />
              <h3 className="text-2xl font-bold text-foreground mb-2">Your gallery is empty</h3>
              <p className="text-muted-foreground max-w-md text-center">
                Click the Upload Image button above to securely store your photos in Cloudinary and access them from anywhere.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((img) => (
                <div key={img.id} className="group bg-card border border-border rounded-none overflow-hidden hover:border-emerald-300 hover:shadow-md transition-all duration-300 shadow-sm">
                  <div className="aspect-square w-full relative overflow-hidden bg-muted">
                    <img 
                      src={img.cloudinary_url || ""} 
                      alt={img.filename} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white text-foreground rounded-none border-none shadow-sm" onClick={() => window.open(img.cloudinary_url || "", "_blank")}>
                        <Maximize2 className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="secondary" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-none border-none shadow-md shadow-emerald-500/30" onClick={() => {
                        const link = document.createElement('a');
                        link.href = img.cloudinary_url || "";
                        link.download = img.filename;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium text-foreground truncate mb-1" title={img.filename}>{img.filename}</p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{new Date(img.created_at).toLocaleDateString()}</span>
                      <span>{img.file_size ? `${(img.file_size / 1024).toFixed(1)} KB` : 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

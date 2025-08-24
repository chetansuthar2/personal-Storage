"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ApiStorage } from "@/lib/storage"
import type { FileItem, FileStats, FileType } from "@/lib/types"
import { Upload, Eye, Download, Share2, Trash2, FileText, ImageIcon, FileVideo, File, RotateCcw, Search, FolderOpen } from "lucide-react"
import { UploadModal } from "@/components/upload-modal"
import { TextEditor } from "@/components/text-editor"
import { FileViewer } from "@/components/file-viewer"

import { SignIn, SignedIn, SignedOut, useUser, useClerk } from "@clerk/nextjs"

export default function HomePage() {
  const { user, isSignedIn, isLoaded } = useUser()
  const { signOut } = useClerk()

  const [files, setFiles] = useState<FileItem[]>([])
  const [stats, setStats] = useState<FileStats>({
    image: 0,
    pdf: 0,
    video: 0,
    text: 0,
    total: 0,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<string>("")
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([])
  const [uploading, setUploading] = useState(false)

  const [uploadModal, setUploadModal] = useState({
    isOpen: false,
    fileType: "image" as FileType,
    fileName: "",
    fileData: "",
    originalFile: null as File | null,
  })
  const [textEditor, setTextEditor] = useState({ isOpen: false })
  const [fileViewer, setFileViewer] = useState<{ isOpen: boolean; file: FileItem | null }>({ 
    isOpen: false,
    file: null,
  })

  const handleSignOut = () => {
    signOut({ redirectUrl: "/" })
  }

  const filterFiles = useCallback(async () => {
    const userId = user?.id
    if (!userId) return

    let result = files

    if (searchQuery.trim()) {
      result = await ApiStorage.searchFiles(userId, searchQuery.trim())
      setFilteredFiles(result)
      return
    }

    if (!activeFilter) {
      setFilteredFiles(files)
      return
    }

    result = result.filter((file) => file.type === activeFilter)
    setFilteredFiles(result)
  }, [files, searchQuery, activeFilter, user?.id])

  useEffect(() => {
    if (isSignedIn && user?.id) {
      void loadData()
    }
  }, [isSignedIn, user?.id])

  useEffect(() => {
    void filterFiles()
  }, [filterFiles])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center text-slate-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  async function loadData() {
    const userId = user?.id
    if (!userId) return

    try {
      const [allFiles, fileStats] = await Promise.all([
        ApiStorage.getFiles(userId),
        ApiStorage.getStats(userId),
      ])

      setFiles(allFiles)
      setFilteredFiles(allFiles)
      setStats(fileStats)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fileType: FileType) => {
    const selected = event.target.files?.[0]
    if (!selected) return

    setUploading(true)

    try {
      const reader = new FileReader()

      reader.onload = (e) => {
        const result = e.target?.result
        if (!result) {
          setUploading(false)
          return
        }

        setUploadModal({
          isOpen: true,
          fileType,
          fileName: selected.name,
          fileData: result as string,
          originalFile: selected,
        })
        setUploading(false)
      }

      if (fileType === "text") {
        reader.readAsText(selected)
      } else {
        reader.readAsDataURL(selected)
      }
    } catch (error) {
      console.error("Upload error:", error)
      setUploading(false)
      alert("Error uploading file. Please try again.")
    }

    event.target.value = ""
  }

  const handleSaveFileWithMetadata = async (name: string, details: string) => {
    if (!uploadModal.originalFile || !user?.id) return

    try {
      const newFile = {
        name: name,
        type: uploadModal.fileType,
        size: uploadModal.originalFile.size,
        content: uploadModal.fileType === "text" ? uploadModal.fileData : uploadModal.fileData,
        details: details,
      }

      const savedFile = await ApiStorage.addFile(user.id, newFile)
      if (savedFile) {
        await loadData()
        alert(`${name} uploaded successfully!`) 
      } else {
        alert("Failed to upload file. Please try again.")
      }
    } catch (error) {
      console.error("Error saving file:", error)
      alert("Error saving file. Please try again.")
    }
  }

  const handleCreateTextDocument = async (topic: string, details: string) => {
    if (!user?.id) return

    try {
      const newFile = {
        name: topic,
        type: "text" as FileType,
        size: new Blob([details]).size,
        content: details,
        details: details,
      }

      const savedFile = await ApiStorage.addFile(user.id, newFile)
      if (savedFile) {
        await loadData()
        alert(`Text document "${topic}" created successfully!`) 
      } else {
        alert("Failed to create text document. Please try again.")
      }
    } catch (error) {
      console.error("Error creating text document:", error)
      alert("Error creating text document. Please try again.")
    }
  }

  const handleTextUpload = () => {
    setTextEditor({ isOpen: true })
  }

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-10 h-10 text-blue-500" />
      case "pdf":
        return <File className="w-10 h-10 text-red-500" />
      case "video":
        return <FileVideo className="w-10 h-10 text-purple-500" />
      case "text":
        return <FileText className="w-10 h-10 text-slate-500" />
    }
  }

  const handleDelete = async (id: string) => {
    if (!user?.id) return

    if (confirm("Are you sure you want to delete this file?")) {
      try {
        const success = await ApiStorage.deleteFile(user.id, id)
        if (success) {
          await loadData()
        } else {
          alert("Failed to delete file. Please try again.")
        }
      } catch (error) {
        console.error("Error deleting file:", error)
        alert("Error deleting file. Please try again.")
      }
    }
  }

  const handleDownload = (file: FileItem) => {
    if (file.type === "text" && file.content) {
      const blob = new Blob([file.content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${file.name}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } else if (file.content) {
      const link = document.createElement("a")
      link.href = file.content
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleShare = async (file: FileItem) => {
    try {
      if (file.type === "text" && file.content) {
        if (navigator.share) {
          await navigator.share({
            title: file.name,
            text: file.content,
          })
        } else {
          await navigator.clipboard.writeText(file.content)
          alert("Text content copied to clipboard!")
        }
      } else if (file.content && navigator.share) {
        const response = await fetch(file.content)
        const blob = await response.blob()
        const fileToShare = new window.File([blob], file.name, { type: blob.type })
        const filesArray = [fileToShare]

        await navigator.share({
          title: file.name,
          files: filesArray,
        })
      } else {
        const shareText = `File: ${file.name}\nType: ${file.type}\nUploaded: ${new Date(file.createdAt || Date.now()).toLocaleDateString()}`
        await navigator.clipboard.writeText(shareText)
        alert("File information copied to clipboard!")
      }
    } catch (error) {
      console.log("Error sharing:", error)
      alert("Sharing not supported on this device")
    }
  }

  const handleView = (file: FileItem) => {
    setFileViewer({ isOpen: true, file })
  }

  const handleRefresh = () => {
    setSearchQuery("")
    setActiveFilter("")
    void loadData()
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <div className="p-4 sm:p-6 lg:p-8">
        <SignedOut>
          <div className="min-h-screen flex items-center justify-center">
            <SignIn routing="hash" />
          </div>
        </SignedOut>

        <SignedIn>
          <div className="max-w-7xl mx-auto space-y-8">
            <header className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200/80 shadow-sm">
              <h1 className="text-2xl font-bold text-slate-900">Personal Storage</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-600 hidden sm:inline">Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress || 'User'}!</span>
                <Button onClick={handleSignOut} variant="outline" className="bg-white border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                  Sign Out
                </Button>
              </div>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[ 
                {label: "Images", value: stats.image, color: "text-blue-600"},
                {label: "PDFs", value: stats.pdf, color: "text-red-600"},
                {label: "Videos", value: stats.video, color: "text-purple-600"},
                {label: "Texts", value: stats.text, color: "text-slate-600"},
              ].map(stat => (
                <Card key={stat.label} className="bg-white border-slate-200/80 hover:shadow-lg hover:-translate-y-1 transition-all">
                  <CardContent className="p-5 text-center">
                    <div className="text-sm font-medium text-slate-500">{stat.label}</div>
                    <div className={`text-4xl font-bold ${stat.color}`}>{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search your files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border-slate-300 pl-11 focus:ring-blue-500 focus:border-blue-500 w-full shadow-sm"
                />
              </div>
              <Button variant="ghost" size="icon" onClick={handleRefresh} className="text-slate-500 hover:text-blue-600 hover:bg-blue-100">
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-3 justify-center p-4 bg-white rounded-lg border border-slate-200/80 shadow-sm">
              {[ 
                {id: "image-upload", type: "image", label: "Upload Image", icon: <ImageIcon className="w-5 h-5 mr-2"/>, accept: "image/*"},
                {id: "pdf-upload", type: "pdf", label: "Upload PDF", icon: <File className="w-5 h-5 mr-2"/>, accept: ".pdf"},
                {id: "video-upload", type: "video", label: "Upload Video", icon: <FileVideo className="w-5 h-5 mr-2"/>, accept: "video/*"},
              ].map(upload => (
                <div key={upload.id}>
                  <input
                    type="file"
                    id={upload.id}
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, upload.type as FileType)}
                    accept={upload.accept}
                    disabled={uploading}
                  />
                  <Button
                    variant="outline"
                    className="bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-700"
                    disabled={uploading}
                    onClick={() => document.getElementById(upload.id)?.click()}
                  >
                    {upload.icon}
                    {uploading ? "Uploading..." : upload.label}
                  </Button>
                </div>
              ))}
               <Button
                variant="outline"
                className="bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-700"
                disabled={uploading}
                onClick={handleTextUpload}
              >
                <FileText className="w-5 h-5 mr-2" />
                Create Text
              </Button>
            </div>

            <div className="flex gap-3 flex-wrap justify-center">
              {[ 
                { key: "", label: "All Files", color: "bg-blue-600 text-white" },
                { key: "image", label: "Images", color: "bg-blue-100 text-blue-800" },
                { key: "pdf", label: "PDFs", color: "bg-red-100 text-red-800" },
                { key: "video", label: "Videos", color: "bg-purple-100 text-purple-800" },
                { key: "text", label: "Texts", color: "bg-slate-100 text-slate-800" },
              ].map((filter) => (
                <Badge
                  key={filter.key}
                  variant={activeFilter === filter.key ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 text-sm rounded-full border-transparent ${activeFilter === filter.key ? filter.color : "bg-white hover:bg-slate-100 text-slate-700"}`}
                  onClick={() => setActiveFilter(filter.key)}
                >
                  {filter.label}
                </Badge>
              ))}
            </div>

            <main className="bg-white/60 rounded-xl p-4 min-h-[400px] border border-slate-200/80 shadow-inner">
              {filteredFiles.length === 0 ? (
                <div className="text-center text-slate-500 py-12 flex flex-col items-center justify-center h-full">
                  <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold text-slate-700">No Files Found</h3>
                  <p className="max-w-md mt-2">
                    {searchQuery.trim()
                      ? `No files found matching "${searchQuery}". Try a different search.`
                      : `No ${activeFilter || 'files'} found. Upload your first file to get started!`}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredFiles.map((file) => (
                    <Card key={file.id} className="overflow-hidden bg-white border-slate-200/80 group transition-all hover:shadow-xl hover:-translate-y-1">
                      <CardContent className="p-0">
                        <div className="h-40 flex items-center justify-center bg-slate-100">
                          {file.type === "image" && file.content ? (
                            <img
                              src={file.content || "/placeholder.svg"}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-slate-400 group-hover:scale-110 transition-transform">{getFileIcon(file.type)}</div>
                          )}
                        </div>

                        <div className="p-4 space-y-3">
                          <h3 className="font-semibold truncate text-slate-900">{file.name}</h3>
                          {file.details && (
                            <p className="text-sm text-slate-500 mt-1 line-clamp-2 h-[40px]">{file.details}</p>
                          )}
                          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                             <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                             <div className="flex gap-1">
                                <Button size="icon" variant="ghost" className="w-8 h-8 text-slate-500 hover:text-blue-600 hover:bg-blue-100" onClick={() => handleView(file)}><Eye className="w-4 h-4" /></Button>
                                <Button size="icon" variant="ghost" className="w-8 h-8 text-slate-500 hover:text-blue-600 hover:bg-blue-100" onClick={() => handleDownload(file)}><Download className="w-4 h-4" /></Button>
                                <Button size="icon" variant="ghost" className="w-8 h-8 text-slate-500 hover:text-blue-600 hover:bg-blue-100" onClick={() => handleShare(file)}><Share2 className="w-4 h-4" /></Button>
                                <Button size="icon" variant="ghost" className="w-8 h-8 text-red-500/70 hover:text-red-600 hover:bg-red-100" onClick={() => handleDelete(file.id)}><Trash2 className="w-4 h-4" /></Button>
                             </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </main>
          </div>

          <UploadModal
            isOpen={uploadModal.isOpen}
            onClose={() => setUploadModal((prev) => ({ ...prev, isOpen: false }))}
            onSave={handleSaveFileWithMetadata}
            fileType={uploadModal.fileType}
            fileName={uploadModal.fileName}
          />

          <TextEditor
            isOpen={textEditor.isOpen}
            onClose={() => setTextEditor({ isOpen: false })}
            onSave={handleCreateTextDocument}
          />

          <FileViewer
            isOpen={fileViewer.isOpen}
            onClose={() => setFileViewer({ isOpen: false, file: null })}
            file={fileViewer.file}
          />
        </SignedIn>
      </div>
    </div>
  )
}
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"
import type { FileItem } from "@/lib/types"

interface FileViewerProps {
  isOpen: boolean
  onClose: () => void
  file: FileItem | null
}

export function FileViewer({ isOpen, onClose, file }: FileViewerProps) {
  const [copied, setCopied] = useState(false)

  if (!file) return null

  const handleCopy = async () => {
    if (file.content || file.details) {
      try {
        await navigator.clipboard.writeText(file.content || file.details || "")
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error("Failed to copy:", error)
      }
    }
  }

  const renderContent = () => {
    switch (file.type) {
      case "image":
        return (
          <div className="space-y-4">
            <img
              src={file.url || "/placeholder.svg"}
              alt={file.name}
              className="max-w-full max-h-96 object-contain mx-auto rounded"
            />
            {file.details && (
              <div>
                <h4 className="font-medium mb-2">Details:</h4>
                <p className="text-sm text-muted-foreground">{file.details}</p>
              </div>
            )}
          </div>
        )
      case "video":
        return (
          <div className="space-y-4">
            <video src={file.url} controls className="max-w-full max-h-96 mx-auto rounded">
              Your browser does not support the video tag.
            </video>
            {file.details && (
              <div>
                <h4 className="font-medium mb-2">Details:</h4>
                <p className="text-sm text-muted-foreground">{file.details}</p>
              </div>
            )}
          </div>
        )
      case "pdf":
        return (
          <div className="space-y-4">
            <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded">
              <p className="text-muted-foreground">PDF Preview not available</p>
              <p className="text-sm text-muted-foreground mt-2">Use download button to view the PDF</p>
            </div>
            {file.details && (
              <div>
                <h4 className="font-medium mb-2">Details:</h4>
                <p className="text-sm text-muted-foreground">{file.details}</p>
              </div>
            )}
          </div>
        )
      case "text":
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded border">
              <pre className="whitespace-pre-wrap text-sm">{file.content}</pre>
            </div>
            {file.details && (
              <div>
                <h4 className="font-medium mb-2">Details:</h4>
                <p className="text-sm text-muted-foreground">{file.details}</p>
              </div>
            )}
            <Button variant="outline" onClick={handleCopy} className="flex items-center gap-2 bg-transparent">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Content"}
            </Button>
          </div>
        )
      default:
        return <p>File type not supported for preview</p>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{file.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  )
}

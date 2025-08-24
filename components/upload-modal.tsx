"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { FileType } from "@/lib/types"

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string, details: string) => void
  fileType: FileType
  fileName: string
}

export function UploadModal({ isOpen, onClose, onSave, fileType, fileName }: UploadModalProps) {
  const [name, setName] = useState(fileName)
  const [details, setDetails] = useState("")

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), details.trim())
      setName("")
      setDetails("")
      onClose()
    }
  }

  const getTitle = () => {
    switch (fileType) {
      case "image":
        return "Image Details"
      case "pdf":
        return "PDF Details"
      case "video":
        return "Video Details"
      default:
        return "File Details"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter file name" />
          </div>
          <div>
            <Label htmlFor="details">Details</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Enter file details"
              rows={4}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!name.trim()}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

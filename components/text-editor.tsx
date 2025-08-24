"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Copy, Check } from "lucide-react"

interface TextEditorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (topic: string, details: string) => void
}

export function TextEditor({ isOpen, onClose, onSave }: TextEditorProps) {
  const [topic, setTopic] = useState("")
  const [details, setDetails] = useState("")
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSave = () => {
    if (topic.trim() && details.trim()) {
      onSave(topic.trim(), details.trim())
      setSaved(true)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(details)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const handleClose = () => {
    setTopic("")
    setDetails("")
    setSaved(false)
    setCopied(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Text Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="topic" className="text-lg font-semibold">
              Topic Name
            </Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic name"
              className="text-lg font-medium bg-yellow-50 border-yellow-200"
            />
          </div>
          <div>
            <Label htmlFor="details" className="text-base">
              Details
            </Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Enter your details here..."
              rows={8}
              className="text-base"
            />
          </div>
          <div className="flex gap-2 justify-between">
            <div className="flex gap-2">
              {saved && (
                <Button variant="outline" onClick={handleCopy} className="flex items-center gap-2 bg-transparent">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Details"}
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                {saved ? "Close" : "Cancel"}
              </Button>
              {!saved && (
                <Button onClick={handleSave} disabled={!topic.trim() || !details.trim()}>
                  Save
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

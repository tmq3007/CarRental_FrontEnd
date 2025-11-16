"use client"

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface BookingActionFormValues {
  note: string
  pictureUrl?: string | null
  chargesCents?: number
}

interface BookingActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  submitLabel: string
  isSubmitting: boolean
  requiresNote?: boolean
  requiresPicture?: boolean
  requiresCharges?: boolean
  onSubmit: (values: BookingActionFormValues) => Promise<void> | void
  initialValues?: Partial<BookingActionFormValues>
}

export function BookingActionDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  isSubmitting,
  requiresNote = true,
  requiresPicture = false,
  requiresCharges = false,
  onSubmit,
  initialValues,
}: BookingActionDialogProps) {
  const [note, setNote] = useState<string>(initialValues?.note ?? "")
  const [pictureUrlInput, setPictureUrlInput] = useState<string>(initialValues?.pictureUrl ?? "")
  const [uploadedPictureUrl, setUploadedPictureUrl] = useState<string>(typeof initialValues?.pictureUrl === "string" ? initialValues?.pictureUrl ?? "" : "")
  const [charges, setCharges] = useState<string>(
    initialValues?.chargesCents !== undefined && initialValues?.chargesCents !== null
      ? String(initialValues.chargesCents)
      : ""
  )

  useEffect(() => {
    if (open) {
      setNote(initialValues?.note ?? "")
      setPictureUrlInput(initialValues?.pictureUrl ?? "")
      setUploadedPictureUrl(initialValues?.pictureUrl ?? "")
      setCharges(
        initialValues?.chargesCents !== undefined && initialValues?.chargesCents !== null
          ? String(initialValues.chargesCents)
          : ""
      )
    }
  }, [open, initialValues])

  const effectivePictureUrl = pictureUrlInput || uploadedPictureUrl || undefined

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) {
      setUploadedPictureUrl("")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      setUploadedPictureUrl(result)
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onSubmit({
      note,
      pictureUrl: effectivePictureUrl ?? null,
      chargesCents: charges ? Number(charges) : undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          {requiresNote && (
            <div className="space-y-2">
              <Label htmlFor="action-note">Note</Label>
              <Textarea
                id="action-note"
                placeholder="Add a note for this action"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={4}
              />
              <p className="text-xs text-slate-400">Notes are shared with the other party for transparency.</p>
            </div>
          )}

          {requiresPicture && (
            <div className="space-y-3">
              <Label htmlFor="action-picture">Picture evidence</Label>
              <Input
                id="action-picture-url"
                type="url"
                placeholder="https://cdn.example.com/evidence.jpg"
                value={pictureUrlInput}
                onChange={(event) => setPictureUrlInput(event.target.value)}
              />
              <div>
                <Input id="action-picture" type="file" accept="image/*" onChange={handleFileChange} />
                <p className="mt-1 text-xs text-slate-400">
                  Upload a picture or paste an existing URL. Only one picture will be attached.
                </p>
              </div>
              {effectivePictureUrl && (
                <img
                  src={effectivePictureUrl}
                  alt="Evidence preview"
                  className="h-24 w-24 rounded-md border object-cover"
                />
              )}
            </div>
          )}

          {requiresCharges && (
            <div className="space-y-2">
              <Label htmlFor="action-charges">Charges (cents)</Label>
              <Input
                id="action-charges"
                type="number"
                min={0}
                step={100}
                value={charges}
                onChange={(event) => setCharges(event.target.value)}
              />
              <p className="text-xs text-slate-400">Enter any additional charges in cents. Leave empty for zero.</p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : submitLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

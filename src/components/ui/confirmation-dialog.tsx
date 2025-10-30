"use client"
import { Button } from "@/components/ui/button" // Assuming Button component is available

interface ConfirmationDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
}

export default function ConfirmationDialog({
                                               isOpen,
                                               onClose,
                                               onConfirm,
                                               title,
                                               description,
                                           }: ConfirmationDialogProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-lg">
                <h2 className="mb-4 text-lg font-semibold">{title}</h2>
                <p className="mb-6 text-sm text-gray-600">{description}</p>
                <div className="flex justify-around border-t border-gray-200 pt-4">
                    <Button variant="ghost" onClick={onClose} className="w-1/2 text-gray-700 hover:bg-gray-100">
                        No
                    </Button>
                    <Button variant="ghost" onClick={onConfirm} className="w-1/2 text-blue-600 hover:bg-blue-50">
                        Yes
                    </Button>
                </div>
            </div>
        </div>
    )
}

"use client"

import { Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface LoginModalProps {
  open: boolean
  onLoginRedirect: () => void
  onSignupRedirect: () => void
  onClose: () => void
}

export function LoginModal({ open, onLoginRedirect, onSignupRedirect, onClose }: LoginModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Login Required</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="text-center">
            <Car className="mx-auto h-12 w-12 text-green-500 mb-3" />
            <p className="text-gray-600 mb-2">You need to be logged in to rent a car.</p>
            <p className="text-sm text-gray-500">Please log in to continue with your booking.</p>
          </div>
          <div className="flex flex-col w-full space-y-3">
            <Button onClick={onLoginRedirect} className="w-full bg-green-500 hover:bg-green-600 text-white">
              Login to Continue
            </Button>
            <Button
              onClick={onSignupRedirect}
              variant="outline"
              className="w-full border-green-500 text-green-500 hover:bg-green-50 bg-transparent"
            >
              Create New Account
            </Button>
            <Button onClick={onClose} variant="ghost" className="w-full text-gray-500 hover:text-gray-700">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

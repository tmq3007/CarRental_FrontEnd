"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SecurityInfo {
    newPassword: string
    confirmPassword: string
}

interface SecurityProps {
    securityInfo: SecurityInfo
    onSecurityChange: (field: string, value: string) => void
    onSave: () => void
    onDiscard: () => void
}

export default function Security({ securityInfo, onSecurityChange, onSave, onDiscard }: SecurityProps) {
    return (
        <div className="space-y-6">
            <div className="max-w-md">
                <h3 className="text-lg font-medium mb-4">Change password</h3>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="newPassword" className="text-sm font-medium">
                            New Password: <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="newPassword"
                            type="password"
                            value={securityInfo.newPassword}
                            onChange={(e) => onSecurityChange("newPassword", e.target.value)}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">
                            Confirm password: <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={securityInfo.confirmPassword}
                            onChange={(e) => onSecurityChange("confirmPassword", e.target.value)}
                            className="mt-1"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
                <Button variant="outline" onClick={onDiscard}>
                    Discard
                </Button>
                <Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700">
                    Save
                </Button>
            </div>
        </div>
    )
}

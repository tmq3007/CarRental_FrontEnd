"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import React, { useEffect, useState } from "react"
import {
    hasValidationErrors,
    validateSecurityInfo
} from "@/lib/validation/user-profile-validation"

interface SecurityInfo {
    currentPassword: string
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
    const [errors, setErrors] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [isFormValid, setIsFormValid] = useState(false)

    useEffect(() => {
        const validationResults = validateSecurityInfo(securityInfo)
        setErrors({
            currentPassword: validationResults.currentPassword || "",
            newPassword: validationResults.newPassword || "",
            confirmPassword: validationResults.confirmPassword || ""
        })
        setIsFormValid(!hasValidationErrors(validationResults))
    }, [securityInfo])

    return (
        <div className="space-y-6">
            <div className="max-w-md">
                <h3 className="text-lg font-medium mb-4">Change password</h3>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="currentPassword" className="text-sm font-medium">
                            Current Password: <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="currentPassword"
                            type="password"
                            value={securityInfo.currentPassword}
                            onChange={(e) => onSecurityChange("currentPassword", e.target.value)}
                            className="mt-1"
                        />
                        {errors.currentPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                        )}
                    </div>

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
                        {errors.newPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                        )}
                        <div className="mt-2 text-xs text-gray-500">
                            <p>Password requirements:</p>
                            <ul className="list-disc pl-5">
                                <li>At least 8 characters</li>
                                <li>1 uppercase letter</li>
                                <li>1 lowercase letter</li>
                                <li>1 number</li>
                                <li>1 special character</li>
                            </ul>
                        </div>
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
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                        )}
                    </div>
                </div>
            </div>

            {!isFormValid && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <div className="flex items-center gap-2 text-red-700 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>Please fix the validation errors above before saving.</span>
                    </div>
                </div>
            )}

            <div className="flex justify-end gap-3 pt-6 border-t">
                <Button variant="outline" onClick={onDiscard}>
                    Discard
                </Button>
                <Button
                    onClick={onSave}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!isFormValid}
                >
                    Save
                </Button>
            </div>
        </div>
    )
}
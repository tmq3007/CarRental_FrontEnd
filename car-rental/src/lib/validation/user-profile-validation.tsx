/**
 * Validation functions for user profile fields
 * These match the C# DTO validation rules
 */

// Validates full name (required, max 100 chars)
export const validateFullName = (value: string): string | undefined => {
    if (!value.trim()) return "Full name is required"
    if (value.length > 100) return "Full name must be less than or equal to 100 characters"

    // Tách chuỗi thành mảng các từ (loại bỏ khoảng trắng thừa)
    const words = value.trim().split(/\s+/)
    if (words.length < 2) return "Full name must contain at least two words"

    return undefined
}


export const validatePhoneNumber = (value: string): string | undefined => {
    if (!value.trim()) return "Phone number is required"
    if (value.length > 20) return "Phone number must be less than or equal to 20 characters"

    // Clean up the value (remove space, dash, parentheses)
    const cleanedValue = value.replace(/[\s\-()]/g, "")

    // Validate Vietnamese phone numbers (03, 05, 07, 08, 09 + 8 digits)
    const phoneRegex = /^(03|05|07|08|09)\d{8}$/
    if (!phoneRegex.test(cleanedValue)) {
        return "Invalid phone number format"
    }

    return undefined
}

export const validateEmail = (value: string): string | undefined => {
    if (!value.trim()) return "Email is required";
    if (value.length > 100) return "Email must be less than or equal to 100 characters";

    // Regex kiểm tra định dạng email cơ bản
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        return "Invalid email format";
    }

    return undefined;
};

// Validates national ID (required, max 20 chars)
export const validateNationalId = (value: string): string | undefined => {
    if (!value.trim()) return "National ID is required"
    if (value.length > 20) return "National ID must be less than 20 characters"
    return undefined
}

// Validates driving license URI (must be valid URL if provided)
export const validateDrivingLicenseUri = (value: string): string | undefined => {
    if (value && value.trim()) {
        try {
            new URL(value)
        } catch {
            return "Invalid URL format"
        }
    }
    return undefined
}

// Validates house/street (max 10 chars)
export const validateHouseNumberStreet = (value: string): string | undefined => {
    if (value && value.length > 10) return "House/Street must be less than 10 characters"
    return undefined
}

// Validates ward (max 100 chars)
export const validateWard = (value: string): string | undefined => {
    if (value && value.length > 100) return "Ward must be less than 100 characters"
    return undefined
}

// Validates district (max 100 chars)
export const validateDistrict = (value: string): string | undefined => {
    if (value && value.length > 100) return "District must be less than 100 characters"
    return undefined
}

// Validates city/province (max 100 chars)
export const validateCityProvince = (value: string): string | undefined => {
    if (value && value.length > 100) return "City/Province must be less than 100 characters"
    return undefined
}

// Validates date of birth (must be 18+ years old, not in future)
export const validateDateOfBirth = (value: string): string | undefined => {
    if (value) {
        const date = new Date(value)
        const today = new Date()
        if (date > today) return "Date of birth cannot be in the future"

        const age = today.getFullYear() - date.getFullYear()
        if (age < 18) return "Must be at least 18 years old"
    }
    return undefined
}

// Validates all user profile fields
export const validateUserProfile = (profile: {
    fullName?: string
    phoneNumber?: string
    nationalId?: string
    drivingLicenseUri?: string
    houseNumberStreet?: string
    ward?: string
    district?: string
    cityProvince?: string
    dob?: string
    email?: string
}) => {
    return {
        fullName: validateFullName(profile.fullName || ""),
        phoneNumber: validatePhoneNumber(profile.phoneNumber || ""),
        nationalId: validateNationalId(profile.nationalId || ""),
        drivingLicenseUri: validateDrivingLicenseUri(profile.drivingLicenseUri || ""),
        houseNumberStreet: validateHouseNumberStreet(profile.houseNumberStreet || ""),
        ward: validateWard(profile.ward || ""),
        district: validateDistrict(profile.district || ""),
        cityProvince: validateCityProvince(profile.cityProvince || ""),
        dob: validateDateOfBirth(profile.dob || ""),
        email: validateEmail(profile.email || ""),
    }
}

// Check if form has any validation errors
export const hasValidationErrors = (errors: Record<string, string | undefined>): boolean => {
    return Object.values(errors).some((error) => error !== undefined)
}
// Validates current password (required, min 8 chars)
export const validateCurrentPassword = (value: string): string | undefined => {
    if (!value.trim()) return "Current password is required"
    if (value.length < 8) return "Password must be at least 8 characters"
    return undefined
}

// Validates new password (strong password requirements)
export const validateNewPassword = (value: string): string | undefined => {
    if (!value.trim()) return "Password is required"
    if (value.length < 8) return "Password must be at least 8 characters"
    if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter"
    if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter"
    if (!/[0-9]/.test(value)) return "Password must contain at least one number"
    if (!/[^A-Za-z0-9]/.test(value)) return "Password must contain at least one special character"
    return undefined
}

// Validates password confirmation
export const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
    if (!confirmPassword.trim()) return "Please confirm your password"
    if (password !== confirmPassword) return "Passwords do not match"
    return undefined
}

// Validates all security fields (password change)
export const validateSecurityInfo = (securityInfo: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}) => {
    return {
        currentPassword: validateCurrentPassword(securityInfo.currentPassword),
        newPassword: validateNewPassword(securityInfo.newPassword),
        confirmPassword: validateConfirmPassword(securityInfo.newPassword, securityInfo.confirmPassword)
    }
}
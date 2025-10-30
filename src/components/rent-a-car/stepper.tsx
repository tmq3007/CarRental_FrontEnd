"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepperStep {
  id: number
  title: string
  description: string
}

interface StepperProps {
  steps: StepperStep[]
  currentStep: number
  onStepClick: (stepNumber: number) => void
  className?: string
}

export default function Stepper({ steps, currentStep, onStepClick, className }: StepperProps) {
  const completedSteps = currentStep - 1
  const totalSteps = steps.length
  const isCompleted = currentStep > totalSteps
  const isAtFinalStep = currentStep === totalSteps
  const progressPercentage = isCompleted ? 100 : (completedSteps / (totalSteps - 1)) * 100

  const handleStepClick = (stepId: number) => {
    // Prevent going back if at final step or completed
    if (isAtFinalStep || isCompleted) {
      return
    }
    onStepClick(stepId)
  }

  return (
    <div className={cn("bg-white shadow-sm", className)}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6">
        <div className="mb-4 sm:mb-6">
          {/* Step Indicators with Connecting Lines */}
          <div className="relative">
            <div className="flex items-center justify-between w-full">
              {/* Background Progress Line */}
              <div className="absolute top-4 sm:top-5 left-0 right-0 h-0.5 bg-gray-300 mx-2 sm:mx-5">
                <motion.div
                  className="h-full bg-green-600 origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: progressPercentage / 100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>

              {/* Step Indicators */}
              {steps.map((step, index) => {
                const isCurrent = currentStep === step.id
                const isCompletedStep =
                  currentStep > step.id ||
                  (isCompleted && step.id === totalSteps) ||
                  (isCurrent && step.id === totalSteps)
                const isClickable = !isAtFinalStep && !isCompleted

                return (
                  <div key={step.id} className="relative flex flex-col items-center flex-1">
                    {/* Step Circle */}
                    <motion.div
                      className={cn(
                        "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-200 relative z-10",
                        isCurrent && step.id !== totalSteps
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : isCompletedStep
                            ? "bg-green-600 border-green-600 text-white"
                            : "bg-white border-gray-300 text-gray-500",
                        isClickable ? "cursor-pointer hover:border-gray-400" : "cursor-not-allowed opacity-75",
                        isAtFinalStep || isCompleted ? "pointer-events-none" : "",
                      )}
                      onClick={() => handleStepClick(step.id)}
                      whileHover={isClickable ? { scale: 1.05 } : {}}
                      whileTap={isClickable ? { scale: 0.95 } : {}}
                      transition={{ duration: 0.2 }}
                    >
                      {isCompletedStep ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          <Check className="h-3 w-3 sm:h-5 sm:w-5" />
                        </motion.div>
                      ) : (
                        <span className="text-xs sm:text-sm font-medium">{step.id}</span>
                      )}
                    </motion.div>

                    {/* Step Labels */}
                    <div className="mt-2 text-center px-1">
                      <p
                        className={cn(
                          "text-xs sm:text-sm font-medium transition-colors duration-200 leading-tight",
                          isCurrent && step.id !== totalSteps
                            ? "text-indigo-600"
                            : isCompletedStep
                              ? "text-green-600"
                              : "text-gray-500",
                        )}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 hidden sm:block leading-tight">{step.description}</p>
                      {/* Show abbreviated description on mobile */}
                      <p className="text-xs text-gray-400 mt-1 sm:hidden leading-tight">
                        {step.description.length > 20 ? `${step.description.substring(0, 20)}...` : step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

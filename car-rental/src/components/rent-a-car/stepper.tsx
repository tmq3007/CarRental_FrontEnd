"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react"; // Using Check icon for completed steps
import { cn } from "@/lib/utils";

interface StepperStep {
  id: number;
  title: string;
  description: string;
}

interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
  onStepClick: (stepNumber: number) => void;
  className?: string;
}

export default function Stepper({ steps, currentStep, onStepClick, className }: StepperProps) {
  const completedSteps = currentStep - 1;
  const totalSteps = steps.length;
  const isCompleted = currentStep > totalSteps; // Check if all steps are completed
  const progressPercentage = isCompleted ? 100 : (completedSteps / (totalSteps - 1)) * 100;

  return (
    <div className={cn("bg-white shadow-sm", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          {/* Step Indicators with Connecting Lines */}
          <div className="relative">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {/* Background Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-300 mx-5">
                <motion.div
                  className="h-full bg-green-600 origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: progressPercentage / 100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>

              {/* Step Indicators */}
              {steps.map((step, index) => {
                const isCurrent = currentStep === step.id;
                const isCompletedStep = currentStep > step.id || (isCompleted && step.id === totalSteps) || (isCurrent && step.id === totalSteps);
                const isLastStep = index === totalSteps - 1;

                return (
                  <div key={step.id} className="relative flex flex-col items-center">
                    {/* Step Circle */}
                    <motion.div
                      className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full border-2 cursor-pointer transition-all duration-200 relative z-10",
                        isCurrent && step.id !== totalSteps
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : isCompletedStep
                          ? "bg-green-600 border-green-600 text-white"
                          : "bg-white border-gray-300 text-gray-500 hover:border-gray-400"
                      )}
                      onClick={() => onStepClick(step.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isCompletedStep ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          <Check className="h-5 w-5" />
                        </motion.div>
                      ) : (
                        <span className="text-sm font-medium">{step.id}</span>
                      )}
                    </motion.div>

                    {/* Step Labels (Aligned Below Indicators) */}
                    <div className="mt-2 text-center">
                      <p
                        className={cn(
                          "text-sm font-medium transition-colors duration-200",
                          isCurrent && step.id !== totalSteps ? "text-indigo-600" : isCompletedStep ? "text-green-600" : "text-gray-500"
                        )}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-400">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
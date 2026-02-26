import React from 'react';

interface StepProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export default function StepProgressBar({ currentStep, totalSteps, className = '' }: StepProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <div className={`w-full ${className}`}>
      <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="step-progress-bar-fill h-full rounded-full"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={0}
          aria-valuemax={totalSteps}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-muted-foreground">Step {currentStep} of {totalSteps}</span>
        <span className="text-xs font-medium text-primary">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}

import React from 'react';
import { CheckCircle, Clock, Package, Truck, XCircle } from 'lucide-react';

interface TimelineStep {
  label: string;
  status: 'completed' | 'active' | 'pending' | 'cancelled';
  description?: string;
}

interface OrderTimelineStepperProps {
  steps: TimelineStep[];
  currentStatus: string;
}

function getAuraClass(status: string): string {
  switch (status) {
    case 'delivered': return 'aura-emerald';
    case 'shipped': return 'aura-teal';
    case 'confirmed': return 'aura-amber';
    case 'pending': return 'aura-rose';
    default: return '';
  }
}

function getStepIcon(label: string, stepStatus: 'completed' | 'active' | 'pending' | 'cancelled') {
  if (stepStatus === 'cancelled') return <XCircle className="w-5 h-5" />;
  if (stepStatus === 'completed') return <CheckCircle className="w-5 h-5" />;

  const lower = label.toLowerCase();
  if (lower.includes('order') || lower.includes('placed')) return <Package className="w-5 h-5" />;
  if (lower.includes('confirm')) return <CheckCircle className="w-5 h-5" />;
  if (lower.includes('ship') || lower.includes('transit')) return <Truck className="w-5 h-5" />;
  if (lower.includes('deliver')) return <CheckCircle className="w-5 h-5" />;
  return <Clock className="w-5 h-5" />;
}

function getStepColors(stepStatus: 'completed' | 'active' | 'pending' | 'cancelled', index: number) {
  if (stepStatus === 'cancelled') {
    return {
      circle: 'bg-destructive text-destructive-foreground',
      line: 'bg-destructive/30',
    };
  }
  if (stepStatus === 'completed') {
    const colors = [
      'bg-amber-500 text-white',
      'bg-emerald-500 text-white',
      'bg-teal-500 text-white',
      'bg-emerald-600 text-white',
    ];
    return {
      circle: colors[index % colors.length],
      line: 'bg-emerald-400',
    };
  }
  if (stepStatus === 'active') {
    return {
      circle: 'bg-primary text-primary-foreground ring-4 ring-primary/30',
      line: 'bg-muted',
    };
  }
  return {
    circle: 'bg-muted text-muted-foreground',
    line: 'bg-muted',
  };
}

export default function OrderTimelineStepper({ steps, currentStatus }: OrderTimelineStepperProps) {
  return (
    <div className="relative">
      {steps.map((step, index) => {
        const colors = getStepColors(step.status, index);
        const isActive = step.status === 'active';
        const auraClass = isActive ? getAuraClass(currentStatus) : '';

        return (
          <div key={index} className="flex items-start gap-4 mb-6 last:mb-0">
            {/* Step circle + connector */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                  transition-all duration-300 ${colors.circle} ${auraClass}
                `}
              >
                {getStepIcon(step.label, step.status)}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-0.5 h-8 mt-1 ${colors.line} transition-colors duration-300`} />
              )}
            </div>

            {/* Step content */}
            <div className="pt-1.5">
              <p className={`font-semibold text-sm ${
                step.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'
              }`}>
                {step.label}
              </p>
              {step.description && (
                <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

import React from 'react';
import { Check } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
  onStepClick: (step: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ currentStep, totalSteps, steps, onStepClick }) => {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full mb-8">
      {/* Mobile View */}
      <div className="md:hidden bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-end mb-2">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Step {currentStep} of {totalSteps}</div>
            <div className="text-lg font-bold text-gray-900">{steps[currentStep - 1]}</div>
          </div>
          <div className="text-sm font-bold text-primary">{Math.round(progressPercentage)}%</div>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block bg-white pt-6 px-12 pb-14 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-bold text-gray-900">Profile Completion</div>
          <div className="text-sm font-bold text-primary">{Math.round(progressPercentage)}%</div>
        </div>
        
        <div className="relative pb-6">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 rounded-full"></div>
          <div className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-300 ease-out" style={{ width: `${progressPercentage}%` }}></div>
          
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isCompleted = stepNumber < currentStep;
              const isCurrent = stepNumber === currentStep;
              
              return (
                <div key={index} className="flex flex-col items-center group">
                  <button 
                    onClick={() => isCompleted && onStepClick(stepNumber)}
                    disabled={!isCompleted && !isCurrent}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 shadow-sm z-10 
                      ${isCompleted ? 'bg-primary text-white cursor-pointer hover:bg-blue-700 hover:scale-110' : 
                        isCurrent ? 'bg-white border-2 border-primary text-primary' : 
                        'bg-white border border-gray-200 text-gray-400 cursor-not-allowed'}`}
                  >
                    {isCompleted ? <Check size={16} strokeWidth={3} /> : stepNumber}
                  </button>
                  <div className={`mt-3 text-xs font-semibold whitespace-nowrap absolute top-8 transition-colors duration-200
                    ${isCurrent ? 'text-primary' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                    {step}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

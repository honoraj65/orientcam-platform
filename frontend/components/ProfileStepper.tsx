'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const STEPS = [
  { id: 1, label: 'Profil', path: '/profile' },
  { id: 2, label: 'Notes', path: '/profile/grades' },
  { id: 3, label: 'Valeurs', path: '/profile/values' },
  { id: 4, label: 'Test RIASEC', path: '/riasec' },
];

export default function ProfileStepper() {
  const pathname = usePathname();

  const currentStep = STEPS.findIndex((s) => s.path === pathname) + 1 || 1;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1 last:flex-initial">
            {/* Step circle + label */}
            <Link
              href={step.path}
              className="flex flex-col items-center group"
            >
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all
                  ${step.id < currentStep ? 'bg-emerald-500 text-white' : ''}
                  ${step.id === currentStep ? 'bg-blue-600 text-white ring-4 ring-blue-200' : ''}
                  ${step.id > currentStep ? 'bg-gray-200 text-gray-500 group-hover:bg-gray-300' : ''}
                `}
              >
                {step.id < currentStep ? (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`mt-1.5 text-[10px] sm:text-xs font-medium text-center whitespace-nowrap
                  ${step.id === currentStep ? 'text-blue-600 font-bold' : ''}
                  ${step.id < currentStep ? 'text-emerald-600' : ''}
                  ${step.id > currentStep ? 'text-gray-400' : ''}
                `}
              >
                {step.label}
              </span>
            </Link>

            {/* Connector line */}
            {index < STEPS.length - 1 && (
              <div
                className={`flex-1 h-1 mx-1 sm:mx-2 rounded-full mt-[-18px] sm:mt-[-20px]
                  ${step.id < currentStep ? 'bg-emerald-400' : 'bg-gray-200'}
                `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

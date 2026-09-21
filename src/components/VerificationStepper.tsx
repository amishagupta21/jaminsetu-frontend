import { Property } from "@/types";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";

interface VerificationStepperProps {
  property: Property;
}

export const VerificationStepper: React.FC<VerificationStepperProps> = ({ property }) => {
  const checks = property.verificationChecks;

  const steps = [
    {
      level: 1,
      title: "Mobile & Seller KYC",
      description: "Phone verification & basic identity check",
      completed: checks.kycCompleted,
    },
    {
      level: 2,
      title: "Bihar Bhumi Match",
      description: "Jamabandi record verified against official database",
      completed: checks.biharBhumiMatch,
    },
    {
      level: 3,
      title: "Physical Verification",
      description: "On-site road measurement & boundary inspection",
      completed: checks.physicalVerified,
    },
    {
      level: 4,
      title: "30-Year Search Report",
      description: "Full historical title and mutation check (Optional)",
      completed: checks.thirtyYearSearch,
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">Verification Audit Trail</h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.level} className="flex gap-4">
            {/* Timeline dot */}
            <div className="flex flex-col items-center">
              <div>
                {step.completed ? (
                  <CheckCircle2 className="w-8 h-8 text-slate-800" />
                ) : index <= 2 ? (
                  <AlertCircle className="w-8 h-8 text-slate-500" />
                ) : (
                  <Circle className="w-8 h-8 text-slate-300" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-0.5 h-12 my-1 ${step.completed ? "bg-slate-800" : "bg-slate-200"}`} />
              )}
            </div>

            {/* Step content */}
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-slate-900">
                  Level {step.level}: {step.title}
                </h4>
                {step.completed && <span className="text-xs bg-slate-200 text-slate-800 px-2 py-0.5 rounded">✓</span>}
              </div>
              <p className="text-sm text-slate-600 mt-1">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">Verification Status</p>
            <p className="text-lg font-bold text-slate-900">
              {property.verificationTier}/4 Tiers Completed
            </p>
          </div>
          {property.verificationTier >= 3 && (
            <div className="text-right">
              <p className="text-xs text-slate-800 font-semibold">VERIFIED</p>
              <p className="text-2xl">⚫</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

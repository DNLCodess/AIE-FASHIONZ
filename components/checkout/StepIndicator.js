const STEPS = ["Contact", "Address", "Delivery", "Payment"];

export default function StepIndicator({ currentStep }) {
  return (
    <nav aria-label="Checkout progress" className="flex items-center gap-0">
      {STEPS.map((label, idx) => {
        const stepNum = idx + 1;
        const isComplete = currentStep > stepNum;
        const isCurrent = currentStep === stepNum;

        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-none flex items-center justify-center font-body text-sm font-medium transition-colors duration-200 ${
                  isComplete
                    ? "bg-gold text-foreground"
                    : isCurrent
                    ? "border-2 border-gold text-foreground"
                    : "border border-border text-muted"
                }`}
              >
                {isComplete ? "✓" : stepNum}
              </div>
              <span
                className={`font-body text-xs tracking-wide uppercase hidden sm:block ${
                  isCurrent ? "text-foreground" : "text-muted"
                }`}
              >
                {label}
              </span>
            </div>

            {/* Connector */}
            {idx < STEPS.length - 1 && (
              <div
                className={`h-px w-12 sm:w-16 mx-2 mb-4 transition-colors duration-200 ${
                  isComplete ? "bg-gold" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}

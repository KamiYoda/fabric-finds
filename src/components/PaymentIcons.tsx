// Inline SVG payment method logos — clean, monochrome on light cards
export function PayVisa({ className = "" }) {
  return (
    <svg viewBox="0 0 64 24" className={className} aria-label="Visa" role="img">
      <text x="32" y="18" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="18" fill="#1A1F71" fontStyle="italic" letterSpacing="-1">VISA</text>
    </svg>
  );
}
export function PayMastercard({ className = "" }) {
  return (
    <svg viewBox="0 0 48 32" className={className} aria-label="Mastercard" role="img">
      <circle cx="19" cy="16" r="10" fill="#EB001B" />
      <circle cx="29" cy="16" r="10" fill="#F79E1B" opacity="0.92" />
      <path d="M24 8.5a10 10 0 0 1 0 15 10 10 0 0 1 0-15z" fill="#FF5F00" />
    </svg>
  );
}
export function PayApplePay({ className = "" }) {
  return (
    <svg viewBox="0 0 64 24" className={className} aria-label="Apple Pay" role="img">
      <path d="M11.6 6.7c.7-.9 1.2-2.1 1-3.4-1.1.1-2.4.8-3.1 1.7-.6.8-1.2 2-1 3.2 1.2.1 2.4-.6 3.1-1.5zm1 1.6c-1.7-.1-3.2.9-4 .9-.9 0-2.2-.9-3.6-.8-1.8.1-3.5 1.1-4.4 2.7-1.9 3.3-.5 8.1 1.4 10.8.9 1.3 2 2.7 3.4 2.7 1.4-.1 1.9-.9 3.6-.9 1.7 0 2.1.9 3.6.9 1.5 0 2.4-1.3 3.3-2.6 1-1.5 1.5-2.9 1.5-3-.1 0-2.9-1.1-3-4.4 0-2.7 2.3-4 2.4-4.1-1.3-1.9-3.3-2.1-4-2.2z" fill="currentColor"/>
      <text x="22" y="17" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="11" fill="currentColor">Pay</text>
    </svg>
  );
}
export function PayGooglePay({ className = "" }) {
  return (
    <svg viewBox="0 0 72 24" className={className} aria-label="Google Pay" role="img">
      <text x="0" y="17" fontFamily="Inter, sans-serif" fontWeight="500" fontSize="13" fill="#5F6368">G</text>
      <text x="9" y="17" fontFamily="Inter, sans-serif" fontWeight="500" fontSize="13" fill="#EA4335">o</text>
      <text x="18" y="17" fontFamily="Inter, sans-serif" fontWeight="500" fontSize="13" fill="#FBBC05">o</text>
      <text x="27" y="17" fontFamily="Inter, sans-serif" fontWeight="500" fontSize="13" fill="#4285F4">g</text>
      <text x="36" y="17" fontFamily="Inter, sans-serif" fontWeight="500" fontSize="13" fill="#34A853">l</text>
      <text x="40" y="17" fontFamily="Inter, sans-serif" fontWeight="500" fontSize="13" fill="#EA4335">e</text>
      <text x="50" y="17" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="12" fill="#5F6368">Pay</text>
    </svg>
  );
}
export function PayPaypal({ className = "" }) {
  return (
    <svg viewBox="0 0 72 24" className={className} aria-label="PayPal" role="img">
      <text x="0" y="18" fontFamily="Inter, sans-serif" fontWeight="800" fontStyle="italic" fontSize="16" fill="#003087">Pay</text>
      <text x="28" y="18" fontFamily="Inter, sans-serif" fontWeight="800" fontStyle="italic" fontSize="16" fill="#009CDE">Pal</text>
    </svg>
  );
}
export function PayStripe({ className = "" }) {
  return (
    <svg viewBox="0 0 64 24" className={className} aria-label="Stripe" role="img">
      <text x="32" y="18" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="15" fill="#635BFF">stripe</text>
    </svg>
  );
}

export function PaymentMethodsRow({ className = "" }) {
  const cls = "h-7 w-auto";
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {[PayVisa, PayMastercard, PayApplePay, PayGooglePay, PayPaypal, PayStripe].map((Icon, i) => (
        <div
          key={i}
          className="flex h-12 w-20 items-center justify-center rounded-xl border border-border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elegant"
        >
          <Icon className={cls} />
        </div>
      ))}
    </div>
  );
}

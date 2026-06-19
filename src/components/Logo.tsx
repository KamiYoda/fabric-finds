import logoSrc from "../assets/logo.png";

export function Logo({ className = "h-9 w-auto" }: any) {
  return (
    <img src={logoSrc} alt="i-sew" className={className} />
  );
}

export function AnimatedLogo({ className }: any) {
  return (
    <div>
      <Logo className={className} />
    </div>
  );
}

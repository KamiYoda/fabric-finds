import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./Button";

const links = [
  { to: "/#features", label: "Features" },
  { to: "/#how", label: "How it works" },
  { to: "/#showcase", label: "Tailors" },
  { to: "/#testimonials", label: "Testimonials" },
  { to: "/#faq", label: "FAQ" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={`flex items-center justify-between rounded-full px-4 sm:px-6 py-2.5 transition-all duration-300 ${
            scrolled ? "glass shadow-soft" : "bg-transparent"
          }`}
        >
          <Link to="/"><Logo /></Link>
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a key={l.to} href={l.to} className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
            <Link to="/signup"><Button variant="primary" size="sm">Get started</Button></Link>
          </div>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-muted md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {open && (
          <div className="glass mt-2 rounded-3xl p-6 shadow-elegant md:hidden">
            <nav className="flex flex-col gap-4">
              {links.map((l) => (
                <a key={l.to} href={l.to} onClick={() => setOpen(false)} className="text-base font-medium text-foreground">
                  {l.label}
                </a>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setOpen(false)}><Button variant="outline" className="w-full">Sign in</Button></Link>
                <Link to="/signup" onClick={() => setOpen(false)}><Button variant="primary" className="w-full">Get started</Button></Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

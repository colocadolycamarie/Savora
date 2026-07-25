import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const links = [
    { href: '/menu', label: 'Menu' },
    { href: '/about', label: 'Our Story' },
    { href: '/reservations', label: 'Reservations' },
    { href: '/gift-cards', label: 'Gift Cards' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-background/90 backdrop-blur-md py-4 border-b border-white/5' : 'bg-transparent py-8'}`}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <Link
            href="/"
            className="font-serif text-3xl tracking-widest uppercase hover:text-primary transition-colors"
          >
            Savora
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm uppercase tracking-[0.2em] transition-colors hover:text-primary ${location === link.href ? 'text-primary' : 'text-foreground/70'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            className="md:hidden text-foreground hover:text-primary transition-colors p-2"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-background z-50 transition-transform duration-700 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <span className="font-serif text-2xl tracking-widest uppercase">
            Savora
          </span>
          <button
            className="p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 gap-8 p-6">
          {links.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-serif text-3xl uppercase tracking-widest transition-colors ${location === link.href ? 'text-primary' : 'text-foreground/80 hover:text-primary'}`}
              style={{
                transitionDelay: `${i * 100}ms`,
                transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: isOpen ? 1 : 0,
                transition: 'all 0.5s ease-out',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

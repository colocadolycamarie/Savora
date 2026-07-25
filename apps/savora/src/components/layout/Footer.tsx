import { Link } from 'wouter';

export function Footer() {
  return (
    <footer className="bg-card border-t border-white/5 pt-24 pb-12 mt-32">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="md:col-span-2">
            <Link
              href="/"
              className="font-serif text-4xl tracking-widest uppercase mb-8 block"
            >
              Savora
            </Link>
            <p className="text-muted-foreground max-w-sm font-light leading-relaxed">
              An exploration of Philippine culinary heritage, viewed through the
              lens of modern editorial craft. Where every dish tells a story of
              place and time.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-foreground/50 mb-8">
              Location
            </h4>
            <address className="not-italic text-foreground/80 font-light space-y-2">
              <p>12th Floor, The Overture</p>
              <p>BGC, Taguig City</p>
              <p>Metro Manila, Philippines</p>
            </address>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-foreground/50 mb-8">
              Contact
            </h4>
            <div className="text-foreground/80 font-light space-y-2">
              <p>reservations@savora.ph</p>
              <p>+63 2 8123 4567</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs uppercase tracking-widest text-foreground/40">
          <p>&copy; {new Date().getFullYear()} Savora Restaurant</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

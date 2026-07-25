import { Reveal } from '@/components/common/Reveal';
import { usePageTitle } from '@/hooks/use-page-title';

export default function TermsPage() {
  usePageTitle('Terms of Service');
  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-3xl">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6">
            Legal
          </p>
          <h1 className="font-serif text-5xl md:text-6xl mb-12">
            Terms of Service
          </h1>
        </Reveal>

        <Reveal
          delay={150}
          className="space-y-10 text-foreground/70 font-light leading-relaxed"
        >
          <div>
            <h2 className="font-serif text-2xl text-foreground mb-3">
              Reservations
            </h2>
            <p>
              Reservations made through our website are requests and are
              confirmed by our team. We kindly ask that any changes or
              cancellations be made as early as possible so we may offer the
              table to another guest.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground mb-3">
              Gift Cards
            </h2>
            <p>
              Gift cards are non-refundable and may be redeemed for dining
              experiences at Savora. They carry no expiration date unless
              otherwise required by law.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground mb-3">
              Website Use
            </h2>
            <p>
              Content on this site — including photography, text, and design —
              is the property of Savora and may not be reproduced without
              permission.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground mb-3">
              Contact
            </h2>
            <p>
              Questions about these terms can be directed to{' '}
              <a
                href="mailto:reservations@savora.ph"
                className="text-primary hover:underline"
              >
                reservations@savora.ph
              </a>
              .
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

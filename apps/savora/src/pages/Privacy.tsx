import { Reveal } from '@/components/common/Reveal';
import { usePageTitle } from '@/hooks/use-page-title';

export default function PrivacyPage() {
  usePageTitle('Privacy Policy');
  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-3xl">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6">
            Legal
          </p>
          <h1 className="font-serif text-5xl md:text-6xl mb-12">
            Privacy Policy
          </h1>
        </Reveal>

        <Reveal
          delay={150}
          className="space-y-10 text-foreground/70 font-light leading-relaxed"
        >
          <p>
            Savora ("we", "us", "our") respects the privacy of every guest who
            visits our restaurant, our website, or reaches out to our team. This
            policy explains what information we collect and how it is used.
          </p>

          <div>
            <h2 className="font-serif text-2xl text-foreground mb-3">
              Information We Collect
            </h2>
            <p>
              When you make a reservation, purchase a gift card, or contact us,
              we collect the details you provide directly — such as your name,
              email address, phone number, and any preferences or notes you
              share with our team.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground mb-3">
              How We Use It
            </h2>
            <p>
              We use the information you provide solely to confirm reservations,
              fulfill gift card orders, respond to inquiries, and provide a
              thoughtful dining experience. We do not sell guest information to
              third parties.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground mb-3">
              Contact
            </h2>
            <p>
              For any questions about this policy or your information, please
              reach us at{' '}
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

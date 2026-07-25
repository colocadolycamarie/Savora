import { useMemo, useState } from 'react';
import { Reveal } from '@/components/common/Reveal';
import { FormField } from '@/components/common/FormField';
import { Check } from 'lucide-react';
import { validateEmail, validateMessage, validateName } from '@/lib/validation';
import { usePageTitle } from '@/hooks/use-page-title';
import {
  useCreateContactMessage,
  type ApiError,
  type ContactRequestSubject,
  type ErrorResponse,
  type ValidationErrorResponse,
} from '@workspace/api-client-react';

type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>;

const SUBJECTS: { value: ContactRequestSubject; label: string }[] = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'private', label: 'Private Events' },
  { value: 'press', label: 'Press & Media' },
  { value: 'careers', label: 'Careers' },
];

export default function ContactPage() {
  usePageTitle('Contact');

  const [subject, setSubject] = useState<ContactRequestSubject>('general');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  const createMessage = useCreateContactMessage();

  const serverErrorMessage = useMemo(() => {
    if (!createMessage.isError) return null;
    const err = createMessage.error as ApiError<ValidationErrorResponse | ErrorResponse>;
    return err.data?.error ?? 'Something went wrong. Please try again.';
  }, [createMessage.isError, createMessage.error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: FieldErrors = {
      name: validateName(name),
      email: validateEmail(email),
      message: validateMessage(message),
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    createMessage.mutate(
      { data: { subject, name, email, message } },
      {
        onError: (err) => {
          const apiErr = err as ApiError<ValidationErrorResponse | ErrorResponse>;
          if (apiErr.status === 400 && apiErr.data && 'fields' in apiErr.data && apiErr.data.fields) {
            setErrors(apiErr.data.fields as FieldErrors);
          }
        },
      },
    );
  };

  const resetForm = () => {
    createMessage.reset();
    setSubject('general');
    setName('');
    setEmail('');
    setMessage('');
    setErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-52 pb-24">
      <div className="container mx-auto px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start max-w-6xl mx-auto">
          {/* Information */}
          <div className="space-y-16">
            <Reveal>
              <div className="flex items-start justify-between gap-6 flex-wrap">
                <div>
                  <h1 className="font-serif text-5xl md:text-7xl mb-6">Connect</h1>
                  <p className="text-foreground/60 font-light max-w-md">
                    For general inquiries, private events, or press requests, please
                    reach out. We strive to respond within 24 hours.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal
              delay={200}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-12"
            >
              <div>
                <h3 className="text-xs uppercase tracking-[0.3em] text-primary mb-6">Location</h3>
                <address className="not-italic text-foreground/80 font-light space-y-2">
                  <p>12th Floor, The Overture</p>
                  <p>BGC, Taguig City</p>
                  <p>Metro Manila, Philippines</p>
                </address>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=The+Overture+BGC+Taguig+City+Metro+Manila+Philippines"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-xs uppercase tracking-widest border-b border-foreground/30 pb-1 hover:border-foreground transition-colors"
                >
                  View Map
                </a>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-[0.3em] text-primary mb-6">Hours</h3>
                <div className="text-foreground/80 font-light space-y-2">
                  <p>Tuesday — Saturday</p>
                  <p>Dinner: 6:00 PM — 10:30 PM</p>
                  <p className="text-foreground/40 mt-4 text-sm italic">Closed Sunday & Monday</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-[0.3em] text-primary mb-6">Contact</h3>
                <div className="text-foreground/80 font-light space-y-2">
                  <p>reservations@savora.ph</p>
                  <p>+63 2 8123 4567</p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Contact Form */}
          <Reveal delay={400}>
            <div className="bg-card p-8 md:p-12 border border-white/5">
              {createMessage.isSuccess ? (
                <div className="text-center py-16 animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-16 h-16 rounded-full border border-primary flex items-center justify-center mx-auto mb-6 text-primary">
                    <Check size={32} aria-hidden="true" />
                  </div>
                  <h3 className="font-serif text-3xl mb-4 text-primary">Message Sent</h3>
                  <p className="text-foreground/60 font-light mb-8">
                    Thank you for reaching out. A member of our team will be in touch
                    within 24 hours at {email}.
                  </p>
                  <button
                    onClick={resetForm}
                    className="text-xs uppercase tracking-widest text-foreground hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-1"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-8">
                  <h2 className="font-serif text-3xl mb-8">Send an Inquiry</h2>

                  {serverErrorMessage && (
                    <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 px-4 py-3">
                      {serverErrorMessage}
                    </div>
                  )}

                  <FormField
                    as="select"
                    label="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as ContactRequestSubject)}
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s.value} value={s.value} className="bg-card">
                        {s.label}
                      </option>
                    ))}
                  </FormField>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      label="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      error={errors.name}
                      autoComplete="name"
                    />
                    <FormField
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={errors.email}
                      autoComplete="email"
                    />
                  </div>

                  <FormField
                    as="textarea"
                    label="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    error={errors.message}
                  />

                  <button
                    type="submit"
                    disabled={createMessage.isPending}
                    className="w-full border border-white/20 py-4 uppercase tracking-[0.2em] text-sm mt-8 transition-colors hover:bg-white/5 disabled:opacity-60"
                  >
                    {createMessage.isPending ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}



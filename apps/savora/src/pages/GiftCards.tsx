import { useMemo, useState } from 'react';
import { Reveal } from '@/components/common/Reveal';
import { FormField } from '@/components/common/FormField';
import { Check, Mail, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { validateEmail, validateName } from '@/lib/validation';
import { usePageTitle } from '@/hooks/use-page-title';
import {
  useCreateGiftCard,
  type ApiError,
  type ErrorResponse,
  type ValidationErrorResponse,
} from '@workspace/api-client-react';

const PRESET_AMOUNTS = [500, 1000, 2500, 5000];
const MIN_CUSTOM = 500;
const MAX_CUSTOM = 50000;

type Recipient = 'myself' | 'gift';
type DeliveryMethod = 'email' | 'physical';

export default function GiftCardsPage() {
  usePageTitle('Gift Cards');

  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [customError, setCustomError] = useState<string | undefined>();

  const [recipientType, setRecipientType] = useState<Recipient>('gift');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [sender, setSender] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');
  const [delivery, setDelivery] = useState<DeliveryMethod>('email');
  const [mailingAddress, setMailingAddress] = useState('');

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const createGiftCard = useCreateGiftCard();

  const displayRecipientName = recipientType === 'myself' ? sender || 'Your Name' : recipientName || 'Recipient Name';

  const applyCustomAmount = (value: string) => {
    setCustomAmount(value);
    const parsed = Number(value);
    if (!value) {
      setCustomError('Enter an amount.');
      return;
    }
    if (Number.isNaN(parsed) || parsed < MIN_CUSTOM || parsed > MAX_CUSTOM) {
      setCustomError(`Enter an amount between ₱${MIN_CUSTOM.toLocaleString()} and ₱${MAX_CUSTOM.toLocaleString()}.`);
      return;
    }
    setCustomError(undefined);
    setAmount(parsed);
  };

  const validate = () => {
    const next: Record<string, string | undefined> = {
      sender: validateName(sender),
      senderEmail: validateEmail(senderEmail),
    };
    if (recipientType === 'gift') {
      next.recipientName = validateName(recipientName);
      if (delivery === 'email') {
        next.recipientEmail = validateEmail(recipientEmail);
      } else if (!mailingAddress.trim()) {
        next.mailingAddress = 'A mailing address is required for physical delivery.';
      }
    }
    setErrors(next);
    return Object.values(next).every((v) => !v);
  };

  const serverErrorMessage = useMemo(() => {
    if (!createGiftCard.isError) return null;
    const err = createGiftCard.error as ApiError<ValidationErrorResponse | ErrorResponse>;
    return err.data?.error ?? 'Something went wrong. Please try again.';
  }, [createGiftCard.isError, createGiftCard.error]);

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (showCustom && customError) return;
    if (!validate()) return;

    createGiftCard.mutate(
      {
        data: {
          amount,
          recipientType,
          deliveryMethod: delivery,
          recipientName: recipientType === 'gift' ? recipientName : undefined,
          recipientEmail: recipientType === 'gift' && delivery === 'email' ? recipientEmail : undefined,
          mailingAddress: recipientType === 'gift' && delivery === 'physical' ? mailingAddress : undefined,
          senderName: sender,
          senderEmail,
          message: message || undefined,
        },
      },
      {
        onError: (err) => {
          const apiErr = err as ApiError<ValidationErrorResponse | ErrorResponse>;
          if (apiErr.status === 400 && apiErr.data && 'fields' in apiErr.data && apiErr.data.fields) {
            setErrors(apiErr.data.fields as Record<string, string>);
          }
        },
      },
    );
  };

  const resetForm = () => {
    createGiftCard.reset();
    setAmount(1000);
    setCustomAmount('');
    setShowCustom(false);
    setRecipientType('gift');
    setRecipientName('');
    setRecipientEmail('');
    setSender('');
    setSenderEmail('');
    setMessage('');
    setDelivery('email');
    setMailingAddress('');
    setErrors({});
  };

  const confirmationTarget = useMemo(() => {
    if (recipientType === 'myself') return senderEmail || 'your inbox';
    return delivery === 'email' ? recipientEmail || 'their inbox' : 'the mailing address you provided';
  }, [recipientType, delivery, recipientEmail, senderEmail]);

  if (createGiftCard.isSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
        <Reveal className="text-center max-w-lg mx-auto px-6">
          <div className="w-16 h-16 rounded-full border border-primary flex items-center justify-center mx-auto mb-8 text-primary">
            <Check size={32} aria-hidden="true" />
          </div>
          <h1 className="font-serif text-4xl mb-6">
            {recipientType === 'gift' ? `Your gift card is on its way to ${displayRecipientName}` : 'Your Gift Card is Ready'}
          </h1>
          <p className="text-foreground/70 font-light mb-4 leading-relaxed">
            {delivery === 'email'
              ? `A digital gift card for ₱${amount.toLocaleString()} has been sent to ${confirmationTarget}.`
              : `Your physical gift card will ship to ${confirmationTarget} within 3–5 business days.`}
          </p>
          <p className="text-xs uppercase tracking-widest text-foreground/40 mb-8">
            Gift Card Code: {createGiftCard.data.code}
          </p>
          <button
            onClick={resetForm}
            className="border border-white/20 px-8 py-4 text-xs uppercase tracking-[0.2em] hover:bg-white/5 transition-colors"
          >
            Send Another
          </button>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12">
        <Reveal>
          <div className="text-center mb-20">
            <h1 className="font-serif text-5xl md:text-7xl mb-6">The Gift of Savora</h1>
            <p className="text-foreground/60 font-light max-w-lg mx-auto">
              Share the experience. Our digital gift cards are delivered instantly and
              never expire.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start max-w-6xl mx-auto">
          {/* Visual Preview */}
          <Reveal delay={200} className="lg:sticky lg:top-32">
            <div className="relative aspect-[1.6/1] bg-card overflow-hidden shadow-2xl rounded-sm border border-white/10 group">
              <div className="absolute inset-0 z-0">
                <img
                  src="/assets/gift-card-texture.jpg"
                  alt=""
                  className="w-full h-full object-cover opacity-50 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-transparent"></div>
              </div>

              <div className="relative z-10 p-8 md:p-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <h3 className="font-serif text-3xl tracking-widest uppercase">Savora</h3>
                  <span className="text-xs uppercase tracking-[0.3em] text-primary">Gift Card</span>
                </div>

                <div className="space-y-4">
                  <div className="font-serif text-5xl text-primary font-light">
                    ₱{amount.toLocaleString()}
                  </div>

                  <div className="flex justify-between items-end border-t border-white/10 pt-4">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-foreground/40">To</p>
                      <p className="font-serif text-lg">{displayRecipientName}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] uppercase tracking-widest text-foreground/40">From</p>
                      <p className="font-serif text-lg">{sender || 'Your Name'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center mt-6 text-xs uppercase tracking-widest text-foreground/40">
              Digital Preview
            </p>
          </Reveal>

          {/* Form */}
          <Reveal delay={400}>
            <form onSubmit={handlePurchase} noValidate className="space-y-12 bg-card p-8 md:p-12 border border-white/5">
              {serverErrorMessage && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 px-4 py-3">
                  {serverErrorMessage}
                </div>
              )}

              {/* Amount */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.2em] text-foreground mb-4">Select Amount</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {PRESET_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      aria-pressed={!showCustom && amount === amt}
                      onClick={() => {
                        setAmount(amt);
                        setShowCustom(false);
                        setCustomError(undefined);
                      }}
                      className={`py-4 text-sm font-serif transition-colors border ${!showCustom && amount === amt ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 text-foreground/70 hover:border-white/30'}`}
                    >
                      ₱{amt.toLocaleString()}
                    </button>
                  ))}
                  <button
                    type="button"
                    aria-pressed={showCustom}
                    onClick={() => setShowCustom(true)}
                    className={cn(
                      'py-4 text-sm font-sans text-xs uppercase tracking-widest border transition-colors',
                      showCustom
                        ? 'border-primary text-primary bg-primary/10'
                        : 'border-dashed border-white/20 text-foreground/40 hover:border-white/40',
                    )}
                  >
                    Custom
                  </button>
                </div>

                {showCustom && (
                  <FormField
                    label="Custom Amount (₱)"
                    type="number"
                    min={MIN_CUSTOM}
                    max={MAX_CUSTOM}
                    value={customAmount}
                    onChange={(e) => applyCustomAmount(e.target.value)}
                    error={customError}
                    hint={!customError ? `Between ₱${MIN_CUSTOM.toLocaleString()} and ₱${MAX_CUSTOM.toLocaleString()}.` : undefined}
                  />
                )}
              </div>

              {/* Recipient */}
              <div className="space-y-6">
                <h3 className="text-xs uppercase tracking-[0.2em] text-foreground mb-4">Who's it for?</h3>
                <div className="grid grid-cols-2 gap-3" role="group" aria-label="Recipient">
                  <button
                    type="button"
                    aria-pressed={recipientType === 'myself'}
                    onClick={() => setRecipientType('myself')}
                    className={`py-3 text-xs uppercase tracking-widest border transition-colors ${recipientType === 'myself' ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 text-foreground/70 hover:border-white/30'}`}
                  >
                    For Myself
                  </button>
                  <button
                    type="button"
                    aria-pressed={recipientType === 'gift'}
                    onClick={() => setRecipientType('gift')}
                    className={`py-3 text-xs uppercase tracking-widest border transition-colors ${recipientType === 'gift' ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 text-foreground/70 hover:border-white/30'}`}
                  >
                    As a Gift
                  </button>
                </div>

                {recipientType === 'gift' && (
                  <>
                    <div className="grid grid-cols-2 gap-3" role="group" aria-label="Delivery method">
                      <button
                        type="button"
                        aria-pressed={delivery === 'email'}
                        onClick={() => setDelivery('email')}
                        className={`flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-widest border transition-colors ${delivery === 'email' ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 text-foreground/70 hover:border-white/30'}`}
                      >
                        <Mail size={14} aria-hidden="true" /> Email — Instant
                      </button>
                      <button
                        type="button"
                        aria-pressed={delivery === 'physical'}
                        onClick={() => setDelivery('physical')}
                        className={`flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-widest border transition-colors ${delivery === 'physical' ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 text-foreground/70 hover:border-white/30'}`}
                      >
                        <Package size={14} aria-hidden="true" /> Physical Card
                      </button>
                    </div>
                    {delivery === 'physical' && (
                      <p className="text-xs text-foreground/40 font-sans">
                        Physical cards ship within 3–5 business days.
                      </p>
                    )}

                    <FormField
                      label="Recipient Name"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      error={errors.recipientName}
                    />

                    {delivery === 'email' ? (
                      <FormField
                        label="Recipient Email"
                        type="email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        error={errors.recipientEmail}
                      />
                    ) : (
                      <FormField
                        as="textarea"
                        label="Mailing Address"
                        value={mailingAddress}
                        onChange={(e) => setMailingAddress(e.target.value)}
                        error={errors.mailingAddress}
                      />
                    )}
                  </>
                )}
              </div>

              {/* Sender + message */}
              <div className="space-y-6">
                <h3 className="text-xs uppercase tracking-[0.2em] text-foreground mb-4">Your Details</h3>
                <FormField
                  label="Your Name"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  error={errors.sender}
                />
                <FormField
                  label="Your Email"
                  type="email"
                  hint="We'll send your receipt here."
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  error={errors.senderEmail}
                />
                <FormField
                  as="textarea"
                  label="Personal Message"
                  optional
                  maxLength={200}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  hint={`${message.length}/200`}
                />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-foreground/30 mb-3">
                  Preview build — payment is simulated, no card is charged
                </p>
                <button
                  type="submit"
                  disabled={createGiftCard.isPending}
                  className="w-full bg-primary text-primary-foreground py-5 uppercase tracking-[0.2em] text-sm transition-all hover:bg-primary/90 flex justify-center items-center gap-2 disabled:opacity-70"
                >
                  {createGiftCard.isPending ? 'Processing…' : `Purchase • ₱${amount.toLocaleString()}`}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

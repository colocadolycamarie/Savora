import { useMemo, useState } from 'react';
import { Reveal } from '@/components/common/Reveal';
import { FormField } from '@/components/common/FormField';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Check, Clock, Users } from 'lucide-react';
import {
  useCreateReservation,
  useGetAvailability,
  getGetAvailabilityQueryKey,
  type ErrorResponse,
  type ValidationErrorResponse,
} from '@workspace/api-client-react';
import type { ApiError } from '@workspace/api-client-react';
import { validateEmail, validateName, validatePhone } from '@/lib/validation';
import { usePageTitle } from '@/hooks/use-page-title';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const TIMES = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30'];
const PARTY_SIZES = ['1', '2', '3', '4', '5', '6', '7', '8'];
const DEPOSIT_THRESHOLD = 6;
const DEPOSIT_PER_GUEST = 3000;

type FieldErrors = Partial<Record<'name' | 'email' | 'phone', string>>;

function toDateKey(d: Date): string {
  return format(d, 'yyyy-MM-dd');
}

const AVAILABILITY_COPY: Record<string, { label: string; tone: 'success' | 'warning' | 'destructive' }> = {
  available: { label: 'Tables available', tone: 'success' },
  limited: { label: 'Limited availability', tone: 'warning' },
  full: { label: 'Fully booked', tone: 'destructive' },
};

export default function ReservationsPage() {
  usePageTitle('Reservations');
  const { toast } = useToast();

  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>('');
  const [guests, setGuests] = useState<string>('2');
  const [step, setStep] = useState<number>(1);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dietary, setDietary] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  const availabilityParams = { date: date ? toDateKey(date) : '', time, guests: Number(guests) };
  const availabilityQuery = useGetAvailability(availabilityParams, {
    query: {
      queryKey: getGetAvailabilityQueryKey(availabilityParams),
      enabled: !!date && !!time,
    },
  });
  const availability = availabilityQuery.data?.level;

  const createReservation = useCreateReservation();

  const requiresDeposit = Number(guests) >= DEPOSIT_THRESHOLD;
  const depositAmount = Number(guests) * DEPOSIT_PER_GUEST;

  const validateField = (field: 'name' | 'email' | 'phone', value: string) => {
    const message =
      field === 'name'
        ? validateName(value)
        : field === 'email'
          ? validateEmail(value)
          : validatePhone(value);
    setErrors((prev) => ({ ...prev, [field]: message }));
    return message;
  };

  const serverErrorMessage = useMemo(() => {
    if (!createReservation.isError) return null;
    const err = createReservation.error as ApiError<ValidationErrorResponse | ErrorResponse>;
    return err.data?.error ?? 'Something went wrong. Please try again.';
  }, [createReservation.isError, createReservation.error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameError = validateField('name', name);
    const emailError = validateField('email', email);
    const phoneError = validateField('phone', phone);
    if (nameError || emailError || phoneError || !date) {
      toast({
        variant: 'destructive',
        description: 'Please fix the highlighted fields before continuing.',
      });
      return;
    }

    createReservation.mutate(
      {
        data: {
          name,
          email,
          phone,
          date: toDateKey(date),
          time,
          guests: Number(guests),
          dietaryNotes: dietary || undefined,
        },
      },
      {
        onSuccess: () => setStep(3),
        onError: (err) => {
          const apiErr = err as ApiError<ValidationErrorResponse | ErrorResponse>;
          if (apiErr.status === 400 && apiErr.data && 'fields' in apiErr.data && apiErr.data.fields) {
            setErrors(apiErr.data.fields as FieldErrors);
          }
          if (apiErr.status === 409) {
            toast({
              variant: 'destructive',
              description: 'That slot just filled up — please choose another time.',
            });
            setStep(1);
          }
        },
      },
    );
  };

  const resetAll = () => {
    setStep(1);
    setDate(undefined);
    setTime('');
    setGuests('2');
    setName('');
    setEmail('');
    setPhone('');
    setDietary('');
    setErrors({});
    createReservation.reset();
  };

  const confirmation = createReservation.data;

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 lg:gap-32">
        {/* Left Side: Editorial Context */}
        <div className="lg:w-1/2">
          <Reveal>
            <h1 className="font-serif text-5xl md:text-6xl mb-8 leading-tight">
              Reserve
              <br />
              <span className="italic text-primary">Your Table</span>
            </h1>

            <div className="space-y-8 text-foreground/70 font-light pr-8">
              <p>
                Savora offers a single, evolving tasting menu priced at ₱6,500 per
                guest. Please allocate approximately two and a half hours for the
                experience.
              </p>

              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-foreground mb-2">
                  Deposits for Larger Parties
                </h3>
                <p className="text-sm">
                  Parties of {DEPOSIT_THRESHOLD} or more require a ₱{DEPOSIT_PER_GUEST.toLocaleString()}{' '}
                  per-guest deposit to hold the table, credited toward your final bill.
                  Refundable if you cancel more than 48 hours in advance.
                </p>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-foreground mb-2">
                  Dietary Requirements
                </h3>
                <p className="text-sm">
                  We accommodate most dietary restrictions with advance notice. Please
                  specify any allergies when booking.
                </p>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-foreground mb-2">
                  Cancellations
                </h3>
                <p className="text-sm">
                  Cancellations must be made at least 48 hours prior to your
                  reservation to avoid a cancellation fee of ₱3,000 per guest.
                </p>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-foreground mb-2">
                  Dress Code
                </h3>
                <p className="text-sm">
                  Smart elegant. We kindly request gentlemen to wear closed shoes and
                  long trousers.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right Side: Booking Form */}
        <div className="lg:w-1/2 flex items-center justify-center">
          <Reveal delay={200} className="w-full max-w-md">
            <div
              className="bg-card p-8 md:p-12 border border-white/5 relative"
              aria-live="polite"
            >
              {/* Form Steps Indicator */}
              {step < 3 && (
                <div className="flex justify-between items-center mb-10 text-xs uppercase tracking-widest text-foreground/40">
                  <span className={step === 1 ? 'text-primary' : 'text-foreground'}>
                    1. Details
                  </span>
                  <span className="w-8 h-[1px] bg-white/10" aria-hidden="true"></span>
                  <span className={step === 2 ? 'text-primary' : ''}>2. Guest Info</span>
                </div>
              )}

              {/* Step 1: Selection */}
              {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-3">
                    <label className="text-xs uppercase tracking-widest text-foreground/60 flex items-center gap-2">
                      <Users size={14} aria-hidden="true" /> Party Size
                    </label>
                    <div className="grid grid-cols-4 gap-2" role="group" aria-label="Party size">
                      {PARTY_SIZES.map((size) => (
                        <button
                          key={size}
                          type="button"
                          aria-pressed={guests === size}
                          onClick={() => setGuests(size)}
                          className={`py-3 text-sm font-serif transition-colors border ${guests === size ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 text-foreground/70 hover:border-white/30'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {requiresDeposit && (
                      <p className="text-xs text-warning font-sans pt-1">
                        A ₱{depositAmount.toLocaleString()} deposit is required to hold this
                        table (₱{DEPOSIT_PER_GUEST.toLocaleString()} × {guests} guests),
                        settled directly with our host team.
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs uppercase tracking-widest text-foreground/60 flex items-center gap-2">
                      <CalendarIcon size={14} aria-hidden="true" /> Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className={`w-full text-left py-4 px-4 border transition-colors flex justify-between items-center ${date ? 'border-white/30 text-foreground' : 'border-white/10 text-foreground/40'}`}
                        >
                          <span className="font-serif text-lg">
                            {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
                          </span>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-card border-white/10" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(d) => {
                            setDate(d);
                            setTime('');
                          }}
                          disabled={(d) => d < new Date() || d < new Date('1900-01-01')}
                          initialFocus
                          className="font-sans"
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-foreground/40 font-sans">
                      Bookings open up to 60 days ahead.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs uppercase tracking-widest text-foreground/60 flex items-center gap-2">
                      <Clock size={14} aria-hidden="true" /> Time
                    </label>
                    <div className="grid grid-cols-3 gap-3" role="group" aria-label="Reservation time">
                      {TIMES.map((t) => (
                        <button
                          key={t}
                          type="button"
                          disabled={!date}
                          aria-pressed={time === t}
                          onClick={() => setTime(t)}
                          className={`py-3 text-sm transition-colors border ${!date ? 'opacity-30 cursor-not-allowed border-white/5' : time === t ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 text-foreground/70 hover:border-white/30'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {date && time && availabilityQuery.isLoading && (
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-3 border border-white/10 text-foreground/40 font-sans">
                      <div className="h-3 w-3 border border-foreground/30 border-t-foreground/70 rounded-full animate-spin" />
                      Checking availability…
                    </div>
                  )}

                  {date && time && availabilityQuery.isError && (
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-3 border border-destructive/30 text-destructive bg-destructive/10 font-sans">
                      Couldn't check availability — you can still continue.
                    </div>
                  )}

                  {availability && (
                    <div
                      className={cn(
                        'flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-3 border font-sans',
                        availability === 'available' &&
                          'border-success/30 text-success bg-success/10',
                        availability === 'limited' &&
                          'border-warning/30 text-warning bg-warning/10',
                        availability === 'full' &&
                          'border-destructive/30 text-destructive bg-destructive/10',
                      )}
                    >
                      <span
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          availability === 'available' && 'bg-success',
                          availability === 'limited' && 'bg-warning',
                          availability === 'full' && 'bg-destructive',
                        )}
                        aria-hidden="true"
                      />
                      {AVAILABILITY_COPY[availability].label}
                      {availability === 'full' && ' — please choose another time'}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!date || !time || availability === 'full'}
                    className="w-full bg-primary text-primary-foreground py-4 uppercase tracking-[0.2em] text-sm mt-8 transition-opacity disabled:opacity-50 hover:bg-primary/90"
                  >
                    Continue
                  </button>
                </div>
              )}

              {/* Step 2: Contact Info */}
              {step === 2 && (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
                  noValidate
                >
                  <div className="bg-background/50 p-4 border border-white/5 mb-8 text-sm font-light">
                    <p className="flex justify-between mb-1">
                      <span>Date & Time:</span>{' '}
                      <span className="font-serif text-base">
                        {date && format(date, 'MMM d, yyyy')} at {time}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span>Guests:</span>{' '}
                      <span className="font-serif text-base">{guests} People</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs uppercase tracking-widest text-primary mt-4 hover:underline"
                    >
                      Edit Selection
                    </button>
                  </div>

                  {serverErrorMessage && (
                    <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 px-4 py-3">
                      {serverErrorMessage}
                    </div>
                  )}

                  <FormField
                    label="Full Name"
                    placeholder="e.g. Maria Clara"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={(e) => validateField('name', e.target.value)}
                    error={errors.name}
                    autoComplete="name"
                    required
                  />

                  <FormField
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={(e) => validateField('email', e.target.value)}
                    error={errors.email}
                    autoComplete="email"
                    required
                  />

                  <FormField
                    label="Phone"
                    type="tel"
                    placeholder="+63 917 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={(e) => validateField('phone', e.target.value)}
                    error={errors.phone}
                    autoComplete="tel"
                    required
                  />

                  <FormField
                    label="Dietary Restrictions"
                    optional
                    placeholder="e.g. Gluten-free, no shellfish"
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                  />

                  <button
                    type="submit"
                    disabled={createReservation.isPending}
                    className="w-full bg-primary text-primary-foreground py-4 uppercase tracking-[0.2em] text-sm mt-8 transition-all hover:bg-primary/90 flex justify-center disabled:opacity-70"
                  >
                    {createReservation.isPending ? 'Confirming…' : 'Confirm Reservation'}
                  </button>
                </form>
              )}

              {/* Step 3: Success */}
              {step === 3 && confirmation && (
                <div className="text-center py-12 animate-in zoom-in-95 duration-700">
                  <div className="w-16 h-16 rounded-full border border-primary flex items-center justify-center mx-auto mb-6 text-primary">
                    <Check size={32} aria-hidden="true" />
                  </div>
                  <h2 className="font-serif text-3xl mb-4 text-primary">
                    Reservation Confirmed
                  </h2>
                  <p className="text-foreground/70 font-light mb-6">
                    We look forward to welcoming you on <br />
                    <strong className="font-serif text-xl text-foreground font-normal block mt-2">
                      {date && format(date, 'MMMM d, yyyy')} at {time}
                    </strong>
                  </p>
                  <p className="text-xs uppercase tracking-widest text-foreground/40 mb-2">
                    Confirmation Code
                  </p>
                  <p className="font-serif text-2xl tracking-widest mb-6">
                    {confirmation.confirmationCode}
                  </p>
                  <p className="text-xs uppercase tracking-widest text-foreground/40 mb-1">
                    A confirmation email has been sent to {email}.
                  </p>
                  <p className="text-xs text-foreground/40 font-sans mb-12">
                    Need to change plans? Email reservations@savora.ph with your
                    confirmation code to cancel or reschedule.
                  </p>

                  <button
                    type="button"
                    onClick={resetAll}
                    className="border border-white/20 px-8 py-3 text-xs uppercase tracking-widest hover:bg-white/5 transition-colors"
                  >
                    Make Another Booking
                  </button>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

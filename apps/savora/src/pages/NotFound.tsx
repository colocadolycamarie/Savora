import { Link } from 'wouter';
import { usePageTitle } from '@/hooks/use-page-title';

export default function NotFound() {
  usePageTitle('Page Not Found');
  return (
    <div className="min-h-screen w-full flex items-center justify-center pt-32 pb-24 px-6">
      <div className="text-center max-w-md">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6">
          Page Not Found
        </p>
        <h1 className="font-serif text-5xl md:text-6xl mb-8 italic">
          A Table That
          <br />
          Doesn't Exist
        </h1>
        <p className="text-foreground/60 font-light mb-10 leading-relaxed">
          The page you're looking for has been cleared from the setting. Let us
          guide you back to the dining room.
        </p>
        <Link
          href="/"
          className="inline-block border border-white/20 px-8 py-4 uppercase tracking-[0.2em] text-sm transition-colors hover:bg-white/5"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

import { lazy, Suspense } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { CookieConsent } from '@/components/common/CookieConsent';
import { FavoritesProvider } from '@/context/FavoritesContext';

// Route-level code splitting: each page is its own chunk instead of one
// 500KB+ bundle, so a first-time visitor to "/" doesn't pay for the
// Reservations date-picker or Gift Card checkout code up front.
const Home = lazy(() => import('@/pages/Home'));
const MenuPage = lazy(() => import('@/pages/Menu'));
const AboutPage = lazy(() => import('@/pages/About'));
const ReservationsPage = lazy(() => import('@/pages/Reservations'));
const GiftCardsPage = lazy(() => import('@/pages/GiftCards'));
const ContactPage = lazy(() => import('@/pages/Contact'));
const PrivacyPage = lazy(() => import('@/pages/Privacy'));
const TermsPage = lazy(() => import('@/pages/Terms'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const queryClient = new QueryClient();

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center" aria-live="polite">
      <span className="sr-only">Loading page…</span>
      <div className="h-8 w-8 border border-primary/40 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/menu" component={MenuPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/reservations" component={ReservationsPage} />
        <Route path="/gift-cards" component={GiftCardsPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/terms" component={TermsPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <FavoritesProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <ScrollToTop />
              <Layout>
                <Router />
              </Layout>
              <CookieConsent />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </FavoritesProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

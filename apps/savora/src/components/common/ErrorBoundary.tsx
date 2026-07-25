import { Component, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // In a production build this would report to an error-tracking service.
    console.error('Savora encountered an unexpected error:', error);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.assign('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center px-6 bg-background text-foreground">
          <div className="text-center max-w-md">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6">
              Something Didn't Plate Correctly
            </p>
            <h1 className="font-serif text-4xl md:text-5xl mb-6 italic">
              We hit a snag on our end.
            </h1>
            <p className="text-foreground/60 font-light mb-10 leading-relaxed">
              Nothing you did caused this. Please return to the dining room and try
              again — if it keeps happening, our team would like to know.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-block border border-white/20 px-8 py-4 uppercase tracking-[0.2em] text-sm transition-colors hover:bg-white/5"
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import { Reveal } from '@/components/common/Reveal';
import { Link } from 'wouter';
import { usePageTitle } from '@/hooks/use-page-title';

const STATS = [
  { value: '10', label: 'Tasting Courses' },
  { value: '24', label: 'Seats per Evening' },
  { value: '2.5', label: 'Hours, Unhurried' },
  { value: '1', label: 'Evolving Menu' },
];

const CATEGORIES = [
  { name: 'Appetizers', desc: 'Bright openings', img: 'https://images.pexels.com/photos/20807274/pexels-photo-20807274.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Mains', desc: 'The heart of the meal', img: 'https://images.pexels.com/photos/323682/pexels-photo-323682.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Dessert', desc: 'A quiet close', img: 'https://images.pexels.com/photos/5638516/pexels-photo-5638516.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Beverage', desc: 'Pairings & signatures', img: 'https://images.pexels.com/photos/4762719/pexels-photo-4762719.jpeg?auto=compress&cs=tinysrgb&w=1200' },
];

export default function Home() {
  usePageTitle();
  return (
    <div className="w-full">
      {/* SCENE 1: The Arrival (Cinematic Hero) */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/hero-bg.jpg"
            alt="Savora Dining Room"
            className="w-full h-full object-cover object-center opacity-60 scale-105 transform transition-transform duration-[20s] ease-out hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/90" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-24">
          <Reveal delay={200}>
            <p className="text-primary tracking-[0.4em] uppercase text-xs md:text-sm mb-6 font-medium">
              Manila, Philippines
            </p>
          </Reveal>
          <Reveal delay={400}>
            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl mb-8 leading-[0.9] text-foreground mix-blend-plus-lighter">
              <span className="block italic font-light text-foreground/80">
                The Art of
              </span>
              <span className="block mt-2">Savoring</span>
            </h1>
          </Reveal>
          <Reveal delay={600}>
            <p className="text-foreground/70 font-light max-w-lg mx-auto text-lg mb-12">
              A deeply personal exploration of Philippine culinary heritage,
              expressed through modern restraint.
            </p>
          </Reveal>
          <Reveal delay={800}>
            <Link
              href="/reservations"
              className="inline-block border border-white/20 px-10 py-4 uppercase tracking-[0.2em] text-sm hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Reserve a Table
            </Link>
          </Reveal>
        </div>
      </section>

      {/* SCENE 2: Orientation (Stats + Category Grid) */}
      <section className="py-24 md:py-32 px-6 md:px-12 container mx-auto">
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 mb-24 pb-16 border-b border-white/10">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="block font-serif text-4xl md:text-5xl text-primary mb-2">
                  {stat.value}
                </span>
                <span className="block text-[11px] uppercase tracking-[0.2em] text-foreground/50">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
            <h2 className="font-serif text-3xl md:text-4xl">Find Your Course</h2>
            <Link
              href="/menu"
              className="text-xs uppercase tracking-[0.2em] text-primary border-b border-primary/30 pb-1 hover:border-primary transition-colors"
            >
              View full menu
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href="/menu"
                className="group relative aspect-[4/5] overflow-hidden block"
              >
                <img
                  src={cat.img}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <h3 className="font-serif text-xl md:text-2xl text-foreground mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-foreground/60 text-xs font-light">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* SCENE 3: The Philosophy (Editorial Asymmetry) */}
      <section className="py-32 px-6 md:px-12 container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 items-center">
          <div className="md:col-span-5 md:col-start-2">
            <Reveal>
              <h2 className="font-serif text-4xl md:text-6xl mb-8 leading-tight">
                Quiet brilliance
                <br />
                <span className="italic text-primary/80">in every detail.</span>
              </h2>
              <div className="space-y-6 text-foreground/70 font-light text-lg leading-relaxed max-w-md">
                <p>
                  We believe luxury is not about excess, but precision. It is
                  the warmth of the greeting before you are seated, the
                  intentional space between courses, and the uncompromising
                  pursuit of the finest local ingredients.
                </p>
                <p>
                  Every element at Savora is chosen with purpose, creating an
                  environment where the food requires no explanation, only your
                  attention.
                </p>
              </div>
              <div className="mt-12">
                <Link
                  href="/about"
                  className="text-sm uppercase tracking-[0.2em] text-primary border-b border-primary/30 pb-1 hover:border-primary transition-colors"
                >
                  Read our story
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            <Reveal delay={300}>
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <img
                  src="/assets/interior-detail.jpg"
                  alt="Interior Detail"
                  className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-1000"
                />
              </div>
              <p className="text-right mt-4 text-xs uppercase tracking-[0.2em] text-foreground/40">
                The Dining Room, 2024
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SCENE 3: The Craft (Dark, Dramatic Showcase) */}
      <section className="py-32 bg-[#12100E] text-foreground">
        <div className="container mx-auto px-6 md:px-12">
          <Reveal>
            <div className="text-center mb-24">
              <span className="text-xs uppercase tracking-[0.4em] text-primary mb-4 block">
                The Menu
              </span>
              <h2 className="font-serif text-5xl md:text-7xl">
                Expressions of Locale
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            {[
              {
                img: 'https://images.pexels.com/photos/31495671/pexels-photo-31495671.jpeg?auto=compress&cs=tinysrgb&w=1200',
                title: 'Kinilaw',
                desc: 'Yellowfin, calamansi, burnt coconut, smoked salt.',
                delay: 0,
              },
              {
                img: 'https://images.pexels.com/photos/29799014/pexels-photo-29799014.jpeg?auto=compress&cs=tinysrgb&w=1200',
                title: 'Inasal',
                desc: 'Quail, annatto, lemongrass, charred spring onion.',
                delay: 200,
              },
              {
                img: 'https://images.pexels.com/photos/5638555/pexels-photo-5638555.png?auto=compress&cs=tinysrgb&w=1200',
                title: 'Halo',
                desc: 'Ube, carabao milk, jackfruit textures, shaved ice.',
                delay: 400,
              },
            ].map((dish) => (
              <Reveal
                key={dish.title}
                delay={dish.delay}
                className="flex flex-col"
              >
                <div className="aspect-[4/5] overflow-hidden mb-8">
                  <img
                    src={dish.img}
                    alt={dish.title}
                    className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                  />
                </div>
                <h3 className="font-serif text-3xl mb-3">{dish.title}</h3>
                <p className="text-foreground/60 font-light text-sm">
                  {dish.desc}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-24 text-center">
            <Link
              href="/menu"
              className="inline-flex items-center gap-4 text-sm uppercase tracking-[0.2em] hover:text-primary transition-colors group"
            >
              <span>View the tasting menu</span>
              <span className="w-12 h-[1px] bg-foreground group-hover:w-16 group-hover:bg-primary transition-all duration-300"></span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* SCENE 4: The Epilogue (Large Typography, Deep Impact) */}
      <section className="py-40 px-6 md:px-12 container mx-auto">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <blockquote className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.1] text-center">
              "We strip away the unnecessary, leaving only the{' '}
              <span className="italic text-primary">essential</span> truth of
              the ingredient."
            </blockquote>
            <p className="text-center mt-12 text-sm uppercase tracking-[0.3em] text-foreground/50">
              — Executive Chef
            </p>
          </Reveal>
        </div>
      </section>

      {/* SCENE 5: Reservation Callout (Structured, Formal) */}
      <section className="py-32 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <img
            src="/assets/chef-plating.jpg"
            alt="Background"
            className="w-full h-full object-cover grayscale"
          />
        </div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <h2 className="font-serif text-5xl md:text-7xl mb-6">Join Us</h2>
              <p className="text-foreground/70 font-light max-w-md text-lg mb-8">
                We accept reservations up to 60 days in advance. Our intimate
                dining room accommodates 24 guests per seating.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link
                  href="/reservations"
                  className="bg-primary text-primary-foreground px-8 py-4 uppercase tracking-[0.2em] text-sm text-center hover:bg-primary/90 transition-colors"
                >
                  Book a Table
                </Link>
                <Link
                  href="/contact"
                  className="border border-white/20 px-8 py-4 uppercase tracking-[0.2em] text-sm text-center hover:bg-white/5 transition-colors"
                >
                  Private Events
                </Link>
              </div>
            </Reveal>
            <Reveal delay={200} className="hidden lg:flex justify-end">
              <div className="w-64 h-64 border-[0.5px] border-primary/30 rounded-full flex items-center justify-center relative p-4">
                <div className="absolute inset-2 border border-dashed border-primary/20 rounded-full animate-spin-slow"></div>
                <div className="text-center">
                  <span className="block text-3xl font-serif text-primary">
                    ₱6,500
                  </span>
                  <span className="block text-xs uppercase tracking-widest text-foreground/50 mt-2">
                    Tasting Menu
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

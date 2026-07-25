import { Reveal } from '@/components/common/Reveal';
import { usePageTitle } from '@/hooks/use-page-title';

export default function AboutPage() {
  usePageTitle('Our Story');
  return (
    <div className="pt-32 pb-24">
      {/* Editorial Spread 1: Introduction */}
      <section className="container mx-auto px-6 md:px-12 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-5">
            <Reveal>
              <h1 className="font-serif text-5xl md:text-7xl mb-8">
                Time, Place,
                <br />
                <span className="italic text-primary">and Memory.</span>
              </h1>
            </Reveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={200}>
              <p className="text-xl font-light text-foreground/80 leading-relaxed mb-6">
                Savora was born from a desire to examine our culinary heritage
                through a lens of profound respect and modern restraint.
              </p>
              <p className="text-base font-light text-foreground/60 leading-relaxed">
                We believe that the most compelling dining experiences are those
                that communicate a distinct sense of place. Every dish on our
                menu is an attempt to capture a fleeting moment in the
                Philippine terroir, refined through meticulous technique.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Editorial Spread 2: Full bleed image */}
      <section className="w-full h-[70vh] mb-32">
        <Reveal className="w-full h-full">
          <img
            src="/assets/chef-plating.jpg"
            alt="Chef plating"
            className="w-full h-full object-cover grayscale-[20%]"
          />
        </Reveal>
      </section>

      {/* Editorial Spread 3: Asymmetric layout */}
      <section className="container mx-auto px-6 md:px-12 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <Reveal>
            <div className="aspect-[3/4] max-w-md mx-auto md:ml-0 overflow-hidden">
              <img
                src="/assets/dish-1.jpg"
                alt="Culinary detail"
                className="w-full h-full object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="max-w-md">
              <h2 className="text-xs uppercase tracking-[0.4em] text-primary mb-6">
                The Craft
              </h2>
              <h3 className="font-serif text-4xl mb-6">Obsessive Restraint</h3>
              <div className="space-y-6 text-foreground/70 font-light leading-relaxed">
                <p>
                  To elevate an ingredient, one must first know how to step out
                  of its way. Our kitchen is defined not by how many elements we
                  can put on a plate, but by how few.
                </p>
                <p>
                  We source exclusively from a network of independent farmers,
                  foragers, and fishermen across the archipelago. The menu is
                  dictated solely by what is optimal on any given day.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Editorial Spread 4: The Team */}
      <section className="bg-card py-32 mt-32">
        <div className="container mx-auto px-6 md:px-12">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="font-serif text-4xl mb-6">The Makers</h2>
              <p className="text-foreground/60 font-light">
                A collective of individuals bound by a shared obsession with
                hospitality and craft.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                name: 'Julian Reyes',
                role: 'Executive Chef',
                desc: 'Formerly of Noma and Toyo Eatery, Julian brings a hyper-local approach to modern technique.',
              },
              {
                name: 'Elena Santos',
                role: 'Head Sommelier',
                desc: 'Curating a cellar focused on low-intervention wines and bespoke local ferments.',
              },
              {
                name: 'Marcus Go',
                role: 'Director of Hospitality',
                desc: 'Ensuring the dining room remains a sanctuary of effortless, invisible service.',
              },
            ].map((person, i) => (
              <Reveal key={person.name} delay={i * 200}>
                <div className="border-t border-white/10 pt-6">
                  <h3 className="font-serif text-2xl mb-1">{person.name}</h3>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">
                    {person.role}
                  </p>
                  <p className="text-foreground/60 font-light text-sm">
                    {person.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

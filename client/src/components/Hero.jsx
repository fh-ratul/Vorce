import { Link } from 'react-router-dom';
import { imageUrl } from '../lib/format';

const Hero = () => (
  <section className="relative overflow-hidden border-b border-gold/10">
    <div className="absolute inset-0 bg-grid bg-[size:48px_48px] opacity-20" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,169,107,0.22),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_55%)]" />
    <div className="relative mx-auto grid min-h-[78vh] max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
      <div>
        <p className="mb-4 text-sm uppercase tracking-[0.5em] text-gold">Premium menswear / New era</p>
        <h1 className="max-w-4xl font-display text-6xl uppercase leading-none text-ivory sm:text-7xl lg:text-8xl">
          Dress Like The Threat In The Room.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-ivory/70 sm:text-lg">
          VORCE builds hard-edged luxury for young men who want clean silhouettes, brutal confidence, and zero wasted noise.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center border border-gold bg-gold px-8 py-4 text-sm font-bold uppercase tracking-[0.25em] text-black hover:bg-transparent hover:text-gold"
          >
            Enter The Drop
          </Link>
          <a
            href="#featured"
            className="inline-flex items-center justify-center border border-ivory/15 px-8 py-4 text-sm font-bold uppercase tracking-[0.25em] text-ivory hover:border-gold hover:text-gold"
          >
            See Selection
          </a>
        </div>
      </div>

      <div className="glass-panel luxury-border relative overflow-hidden rounded-[2rem] p-8 shadow-glow">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(200,169,107,0.24),transparent_28%)]" />
        <div className="relative space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-gold">Current signal</p>
            <p className="mt-4 font-display text-4xl uppercase leading-tight text-ivory">Midnight tailoring with combat intent.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/5 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.4em] text-ivory/40">Identity</p>
              <p className="mt-2 text-lg font-bold uppercase tracking-[0.18em] text-ivory">Sharp. Dark. Precise.</p>
            </div>
            <div className="rounded-3xl border border-gold/10 bg-gold/5 p-5">
              <p className="text-xs uppercase tracking-[0.4em] text-ivory/40">Release model</p>
              <p className="mt-2 text-lg font-bold uppercase tracking-[0.18em] text-gold">Limited quantity</p>
            </div>
          </div>
          <div className="h-72 overflow-hidden rounded-[1.75rem] border border-gold/10 bg-[linear-gradient(150deg,#0f0f0f_0%,#191919_45%,#050505_100%)]">
            <img
              src={imageUrl('/media/images/hood-1.avif')}
              alt="VORCE spotlight"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;

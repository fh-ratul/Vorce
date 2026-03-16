import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <section className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
    <div className="glass-panel rounded-[2rem] p-10 text-center">
      <p className="text-xs uppercase tracking-[0.45em] text-gold">404</p>
      <h1 className="mt-4 font-display text-6xl uppercase text-ivory">Nothing Here</h1>
      <p className="mt-4 text-ivory/60">The page you requested does not exist in the current VORCE route map.</p>
      <Link to="/" className="mt-8 inline-flex items-center justify-center rounded-full border border-gold bg-gold px-8 py-4 text-sm font-bold uppercase tracking-[0.25em] text-black hover:bg-transparent hover:text-gold">
        Return Home
      </Link>
    </div>
  </section>
);

export default NotFoundPage;

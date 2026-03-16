import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../lib/api';

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/products/featured');
        setFeatured(data);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div>
      <Hero />

      <section id="featured" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gold">Curated selection</p>
            <h2 className="mt-3 font-display text-5xl uppercase text-ivory">Featured Arsenal</h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center border border-gold/30 px-6 py-3 text-sm uppercase tracking-[0.25em] text-gold hover:bg-gold hover:text-black"
          >
            View Full Catalog
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-gold/10 bg-black/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            'High-density fabrics with severe silhouettes',
            'Drops engineered for presence, not volume',
            'Luxury details without decorative clutter',
          ].map((item) => (
            <div key={item} className="glass-panel rounded-[1.5rem] p-6">
              <p className="text-xs uppercase tracking-[0.4em] text-gold">VORCE Code</p>
              <p className="mt-4 text-lg leading-7 text-ivory/75">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;

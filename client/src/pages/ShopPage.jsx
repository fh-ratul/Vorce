import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../lib/api';

const initialFilters = {
  search: '',
  category: '',
  size: '',
  minPrice: '',
  maxPrice: '',
};

const ShopPage = () => {
  const [filters, setFilters] = useState(initialFilters);
  const [products, setProducts] = useState([]);
  const [options, setOptions] = useState({ categories: [], sizes: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const { data } = await api.get('/products', { params: filters });
        setProducts(data.products);
        setOptions(data.filters);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4">
        <p className="text-xs uppercase tracking-[0.45em] text-gold">Catalog</p>
        <h1 className="font-display text-5xl uppercase text-ivory sm:text-6xl">Luxury Without Permission</h1>
        <p className="max-w-2xl text-ivory/65">Search, filter, and move through the current VORCE drop with zero distraction.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <ProductFilters
          filters={filters}
          options={options}
          onChange={handleFilterChange}
          onReset={() => setFilters(initialFilters)}
        />

        <div>
          {loading ? (
            <LoadingSpinner />
          ) : products.length === 0 ? (
            <div className="glass-panel rounded-[1.75rem] p-10 text-center text-ivory/60">No products match the current filter set.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ShopPage;

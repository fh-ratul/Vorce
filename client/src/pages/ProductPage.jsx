import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import api from '../lib/api';
import { formatCurrency, imageUrl } from '../lib/format';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setSelectedSize(data.sizes?.[0] || '');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Login required to build your cart');
      navigate('/login');
      return;
    }

    await addToCart({ productId: product._id, size: selectedSize, quantity });
    navigate('/cart');
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!product) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[2rem] border border-gold/10 bg-black/40">
            {product.images?.[0] ? (
              <img src={imageUrl(product.images[0])} alt={product.name} className="h-[560px] w-full object-cover" />
            ) : (
              <div className="h-[560px] bg-[radial-gradient(circle_at_top,rgba(200,169,107,0.18),transparent_30%),linear-gradient(180deg,#191919,#050505)]" />
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {product.images?.slice(1, 4).map((image) => (
              <img key={image} src={imageUrl(image)} alt={product.name} className="h-32 w-full rounded-[1.25rem] object-cover" />
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-8">
          <p className="text-xs uppercase tracking-[0.45em] text-gold">{product.category}</p>
          <h1 className="mt-4 font-display text-5xl uppercase leading-none text-ivory">{product.name}</h1>
          <p className="mt-6 text-2xl font-bold uppercase tracking-[0.12em] text-gold">{formatCurrency(product.price)}</p>
          <p className="mt-6 text-base leading-7 text-ivory/70">{product.description}</p>

          <div className="mt-8">
            <p className="text-sm uppercase tracking-[0.25em] text-ivory/50">Select size</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-full border px-5 py-3 text-sm font-bold uppercase tracking-[0.25em] ${
                    selectedSize === size
                      ? 'border-gold bg-gold text-black'
                      : 'border-white/10 bg-black/30 text-ivory hover:border-gold/40'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="w-24 rounded-full border border-white/10 bg-black/40 px-4 py-3 text-center text-ivory"
            />
            <button
              type="button"
              onClick={handleAddToCart}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-gold bg-gold px-8 py-4 text-sm font-bold uppercase tracking-[0.25em] text-black hover:bg-transparent hover:text-gold"
            >
              Add To Cart
            </button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.25rem] border border-white/5 bg-black/30 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-gold">Badge</p>
              <p className="mt-3 text-lg uppercase tracking-[0.15em] text-ivory">{product.badge || 'Core Line'}</p>
            </div>
            <div className="rounded-[1.25rem] border border-white/5 bg-black/30 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-gold">Stock</p>
              <p className="mt-3 text-lg uppercase tracking-[0.15em] text-ivory">{product.stock} units</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPage;

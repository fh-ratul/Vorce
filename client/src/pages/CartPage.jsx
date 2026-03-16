import { Link, Navigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { formatCurrency, imageUrl } from '../lib/format';
import LoadingSpinner from '../components/LoadingSpinner';

const CartPage = () => {
  const { user } = useAuth();
  const { cart, loading, updateCartItem, removeCartItem } = useCart();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4">
        <p className="text-xs uppercase tracking-[0.4em] text-gold">Cart</p>
        <h1 className="font-display text-5xl uppercase text-ivory">Your Command Queue</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {cart.items.length === 0 ? (
            <div className="glass-panel rounded-[1.75rem] p-10 text-center">
              <p className="text-ivory/60">Your cart is empty.</p>
              <Link to="/shop" className="mt-6 inline-flex border border-gold px-6 py-3 text-sm uppercase tracking-[0.25em] text-gold hover:bg-gold hover:text-black">
                Shop Now
              </Link>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item._id} className="glass-panel flex flex-col gap-4 rounded-[1.75rem] p-4 sm:flex-row">
                {item.image ? (
                  <img src={imageUrl(item.image)} alt={item.name} className="h-36 w-full rounded-[1.25rem] object-cover sm:w-32" />
                ) : (
                  <div className="h-36 w-full rounded-[1.25rem] bg-gradient-to-br from-graphite to-black sm:w-32" />
                )}
                <div className="flex flex-1 flex-col justify-between gap-4">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div>
                      <p className="font-display text-2xl uppercase text-ivory">{item.name}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.25em] text-gold">Size {item.size}</p>
                    </div>
                    <p className="text-lg font-bold uppercase tracking-[0.15em] text-ivory">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) => updateCartItem(item._id, { quantity: Number(event.target.value) })}
                      className="w-24 rounded-full border border-white/10 bg-black/40 px-4 py-3 text-center text-ivory"
                    />
                    <button
                      type="button"
                      onClick={() => removeCartItem(item._id)}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.25em] text-ivory/60 hover:border-gold hover:text-gold"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="glass-panel h-fit rounded-[1.75rem] p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">Summary</p>
          <div className="mt-6 space-y-4 text-sm uppercase tracking-[0.18em] text-ivory/60">
            <div className="flex items-center justify-between">
              <span>Items</span>
              <span>{cart.itemCount}</span>
            </div>
            <div className="flex items-center justify-between text-ivory">
              <span>Subtotal</span>
              <span className="text-xl font-bold tracking-[0.1em]">{formatCurrency(cart.subtotal)}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-gold bg-gold px-6 py-4 text-sm font-bold uppercase tracking-[0.25em] text-black hover:bg-transparent hover:text-gold"
          >
            Proceed To Checkout
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CartPage;

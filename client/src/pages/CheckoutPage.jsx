import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import api from '../lib/api';
import { formatCurrency } from '../lib/format';

const initialAddress = {
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('SSLCommerz');
  const [address, setAddress] = useState({ ...initialAddress, ...user?.address });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (paymentMethod === 'SSLCommerz') {
        const { data } = await api.post('/payment/init', { shippingAddress: address });

        if (data.url) {
          window.location.href = data.url;
          return;
        }

        throw new Error('Payment gateway URL missing');
      }

      const { data } = await api.post('/payment/cod', { shippingAddress: address });
      navigate(`/order-confirmation?order_id=${data._id}&payment=cod`, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit} className="glass-panel rounded-[2rem] p-8">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">Checkout</p>
          <h1 className="mt-4 font-display text-5xl uppercase text-ivory">Delivery Command</h1>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('SSLCommerz')}
              className={`rounded-[1.5rem] border p-5 text-left transition ${
                paymentMethod === 'SSLCommerz'
                  ? 'border-gold bg-gold/10'
                  : 'border-white/10 bg-black/20 hover:border-gold/40'
              }`}
            >
              <p className="text-xs uppercase tracking-[0.35em] text-gold">Option 1</p>
              <h2 className="mt-2 font-display text-2xl uppercase text-ivory">Pay Online</h2>
              <p className="mt-2 text-sm text-ivory/60">SSLCommerz (card / mobile banking / internet banking)</p>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('COD')}
              className={`rounded-[1.5rem] border p-5 text-left transition ${
                paymentMethod === 'COD'
                  ? 'border-gold bg-gold/10'
                  : 'border-white/10 bg-black/20 hover:border-gold/40'
              }`}
            >
              <p className="text-xs uppercase tracking-[0.35em] text-gold">Option 2</p>
              <h2 className="mt-2 font-display text-2xl uppercase text-ivory">Cash on Delivery</h2>
              <p className="mt-2 text-sm text-ivory/60">Place order now, pay cash when your order arrives.</p>
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {Object.entries(address).map(([key, value]) => (
              <label key={key} className={`block text-sm uppercase tracking-[0.18em] text-ivory/60 ${key === 'line1' || key === 'line2' ? 'sm:col-span-2' : ''}`}>
                {key.replace(/([A-Z])/g, ' $1')}
                <input
                  type="text"
                  required={key !== 'line2'}
                  value={value}
                  onChange={(event) => setAddress((current) => ({ ...current, [key]: event.target.value }))}
                  className="mt-2 w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-ivory"
                />
              </label>
            ))}
          </div>
          <button
            type="submit"
            disabled={submitting || cart.items.length === 0}
            className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-gold bg-gold px-6 py-4 text-sm font-bold uppercase tracking-[0.25em] text-black hover:bg-transparent hover:text-gold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? paymentMethod === 'SSLCommerz'
                ? 'Redirecting...'
                : 'Placing Order...'
              : paymentMethod === 'SSLCommerz'
                ? 'Pay Online with SSLCommerz'
                : 'Place COD Order'}
          </button>
        </form>

        <div className="glass-panel h-fit rounded-[2rem] p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">Order total</p>
          <div className="mt-4 space-y-3 text-sm text-ivory/60">
            {cart.items.map((item) => (
              <div key={item._id} className="flex items-center justify-between gap-4">
                <span>{item.name} x {item.quantity}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6 text-lg font-bold uppercase tracking-[0.12em] text-ivory">
            <span>Total</span>
            <span>{formatCurrency(cart.subtotal)}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;

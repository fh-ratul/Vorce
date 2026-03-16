import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import api from '../lib/api';
import { formatCurrency, formatDate } from '../lib/format';

const emptyAddress = {
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
};

const DashboardPage = () => {
  const { user, updateUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    address: { ...emptyAddress, ...user?.address },
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/mine');
        setOrders(data);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await api.put('/users/profile', form);
      updateUser(data);
      setForm((current) => ({ ...current, password: '' }));
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Profile update failed');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.45em] text-gold">Dashboard</p>
        <h1 className="mt-4 font-display text-5xl uppercase text-ivory">Your VORCE Profile</h1>
      </div>

      <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
        <form onSubmit={handleProfileSubmit} className="glass-panel rounded-[2rem] p-8">
          <h2 className="font-display text-3xl uppercase text-ivory">Profile</h2>
          <div className="mt-6 space-y-4">
            <label className="block text-sm uppercase tracking-[0.18em] text-ivory/60">
              Name
              <input type="text" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="mt-2 w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-ivory" />
            </label>
            <label className="block text-sm uppercase tracking-[0.18em] text-ivory/60">
              Email
              <input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="mt-2 w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-ivory" />
            </label>
            <label className="block text-sm uppercase tracking-[0.18em] text-ivory/60">
              New password
              <input type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} className="mt-2 w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-ivory" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(form.address).map(([key, value]) => (
                <label key={key} className={`block text-sm uppercase tracking-[0.18em] text-ivory/60 ${key === 'line1' || key === 'line2' ? 'sm:col-span-2' : ''}`}>
                  {key.replace(/([A-Z])/g, ' $1')}
                  <input
                    type="text"
                    value={value}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        address: { ...current.address, [key]: event.target.value },
                      }))
                    }
                    className="mt-2 w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-ivory"
                  />
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-gold bg-gold px-6 py-4 text-sm font-bold uppercase tracking-[0.25em] text-black hover:bg-transparent hover:text-gold">
            Save Profile
          </button>
        </form>

        <div className="glass-panel rounded-[2rem] p-8">
          <h2 className="font-display text-3xl uppercase text-ivory">Order History</h2>
          <div className="mt-6 space-y-4">
            {orders.length === 0 ? (
              <div className="rounded-[1.5rem] border border-white/5 bg-black/20 p-6 text-ivory/60">No orders yet.</div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="rounded-[1.5rem] border border-white/5 bg-black/20 p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-gold">{formatDate(order.createdAt)}</p>
                      <p className="mt-2 font-display text-2xl uppercase text-ivory">{formatCurrency(order.totalPrice)}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full border border-gold/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-gold">
                          {order.paymentMethod}
                        </span>
                        <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-ivory/75">
                          {order.paymentMethod === 'COD' ? 'Pay on Delivery' : 'Paid Online'}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm uppercase tracking-[0.18em] text-ivory/60">
                      <p>Payment: {order.paymentStatus}</p>
                      <p>Delivery: {order.orderStatus}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-ivory/45">
                    {order.items.map((item) => (
                      <span key={`${order._id}-${item.product}-${item.size}`} className="rounded-full border border-white/10 px-3 py-2">
                        {item.name} / {item.size} x {item.quantity}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;

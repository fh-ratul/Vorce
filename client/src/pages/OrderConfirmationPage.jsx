import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../lib/api';
import { formatCurrency, formatDate } from '../lib/format';

const OrderConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const orderId = searchParams.get('order_id');
  const paymentState = searchParams.get('payment');

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get(`/orders/${orderId}`);
        setOrder(data);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="glass-panel rounded-[2rem] p-8 text-center">
        <p className="text-xs uppercase tracking-[0.45em] text-gold">
          {paymentState === 'failed' || paymentState === 'cancelled' ? 'Payment update' : 'Order update'}
        </p>
        <h1 className="mt-4 font-display text-5xl uppercase text-ivory">Order Locked In</h1>
        {order ? (
          <div className="mt-8 space-y-4 text-left text-ivory/70">
            <p>Order placed on {formatDate(order.createdAt)}.</p>
            <p>Total: <span className="text-gold">{formatCurrency(order.totalPrice)}</span></p>
            <p>Payment Method: {order.paymentMethod}</p>
            <p>Payment Status: {order.paymentStatus}</p>
            <p>Order Status: {order.orderStatus}</p>
          </div>
        ) : (
          <p className="mt-6 text-ivory/60">No order information was provided.</p>
        )}
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link to="/dashboard" className="inline-flex items-center justify-center rounded-full border border-gold bg-gold px-8 py-4 text-sm font-bold uppercase tracking-[0.25em] text-black hover:bg-transparent hover:text-gold">
            View Dashboard
          </Link>
          <Link to="/shop" className="inline-flex items-center justify-center rounded-full border border-white/10 px-8 py-4 text-sm font-bold uppercase tracking-[0.25em] text-ivory hover:border-gold hover:text-gold">
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OrderConfirmationPage;

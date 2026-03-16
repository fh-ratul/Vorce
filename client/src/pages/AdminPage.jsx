import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../lib/api';
import { formatCurrency, formatDate, imageUrl } from '../lib/format';

const initialForm = {
  id: null,
  name: '',
  description: '',
  price: '',
  category: '',
  sizes: 'S, M, L',
  stock: '',
  badge: '',
  featured: false,
  images: [],
};

const AdminPage = () => {
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, productCount: 0 });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState('');
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadAdminData = async () => {
    const [statsResponse, productsResponse, ordersResponse] = await Promise.all([
      api.get('/admin/dashboard'),
      api.get('/products'),
      api.get('/admin/orders', {
        params: paymentFilter ? { paymentMethod: paymentFilter } : {},
      }),
    ]);

    setStats(statsResponse.data);
    setProducts(productsResponse.data.products);
    setOrders(ordersResponse.data);
  };

  useEffect(() => {
    const hydrate = async () => {
      try {
        await loadAdminData();
      } finally {
        setLoading(false);
      }
    };

    hydrate();
  }, [paymentFilter]);

  const resetForm = () => {
    setForm(initialForm);
    setFiles([]);
  };

  const handleEdit = (product) => {
    setForm({
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      sizes: product.sizes.join(', '),
      stock: product.stock,
      badge: product.badge || '',
      featured: product.featured,
      images: product.images || [],
    });
    setFiles([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const uploadImages = async () => {
    if (!files.length) {
      return form.images;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    const { data } = await api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.images;
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const uploadedImages = await uploadImages();
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        sizes: form.sizes.split(',').map((size) => size.trim()).filter(Boolean),
        stock: Number(form.stock),
        badge: form.badge || null,
        featured: form.featured,
        images: uploadedImages,
      };

      if (form.id) {
        await api.put(`/admin/products/${form.id}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/admin/products', payload);
        toast.success('Product created');
      }

      await loadAdminData();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Product save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await api.delete(`/admin/products/${productId}`);
      toast.success('Product deleted');
      await loadAdminData();
      if (form.id === productId) {
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleOrderStatusChange = async (orderId, orderStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { orderStatus });
      toast.success('Order status updated');
      await loadAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order status update failed');
    }
  };

  const handleMarkCodPaid = async (orderId) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { paymentStatus: 'Paid' });
      toast.success('COD payment marked as paid');
      await loadAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment update failed');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.45em] text-gold">Admin</p>
        <h1 className="mt-4 font-display text-5xl uppercase text-ivory">Control Room</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['Total orders', stats.totalOrders],
          ['Revenue', formatCurrency(stats.totalRevenue)],
          ['Products', stats.productCount],
        ].map(([label, value]) => (
          <div key={label} className="glass-panel rounded-[1.5rem] p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">{label}</p>
            <p className="mt-3 font-display text-4xl uppercase text-ivory">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[420px_1fr]">
        <form onSubmit={handleProductSubmit} className="glass-panel rounded-[2rem] p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-3xl uppercase text-ivory">{form.id ? 'Edit product' : 'Add product'}</h2>
            {form.id && (
              <button type="button" onClick={resetForm} className="text-xs uppercase tracking-[0.25em] text-ivory/50 hover:text-gold">
                Clear
              </button>
            )}
          </div>
          <div className="mt-6 space-y-4">
            {[
              ['name', 'text'],
              ['category', 'text'],
              ['price', 'number'],
              ['stock', 'number'],
            ].map(([key, type]) => (
              <label key={key} className="block text-sm uppercase tracking-[0.18em] text-ivory/60">
                {key}
                <input
                  type={type}
                  required
                  value={form[key]}
                  onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                  className="mt-2 w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-ivory"
                />
              </label>
            ))}
            <label className="block text-sm uppercase tracking-[0.18em] text-ivory/60">
              Description
              <textarea
                rows="4"
                required
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                className="mt-2 w-full rounded-[1.5rem] border border-white/10 bg-black/40 px-4 py-3 text-ivory"
              />
            </label>
            <label className="block text-sm uppercase tracking-[0.18em] text-ivory/60">
              Sizes
              <input
                type="text"
                value={form.sizes}
                onChange={(event) => setForm((current) => ({ ...current, sizes: event.target.value }))}
                className="mt-2 w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-ivory"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm uppercase tracking-[0.18em] text-ivory/60">
                Badge
                <select value={form.badge} onChange={(event) => setForm((current) => ({ ...current, badge: event.target.value }))} className="mt-2 w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-ivory">
                  <option value="">None</option>
                  <option value="New Drop">New Drop</option>
                  <option value="Limited">Limited</option>
                </select>
              </label>
              <label className="mt-9 inline-flex items-center gap-3 text-sm uppercase tracking-[0.18em] text-ivory/60">
                <input type="checkbox" checked={form.featured} onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))} className="h-4 w-4 rounded border-white/10 bg-black/40" />
                Featured product
              </label>
            </div>
            <label className="block text-sm uppercase tracking-[0.18em] text-ivory/60">
              Images
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(event) => setFiles(Array.from(event.target.files || []))}
                className="mt-2 w-full rounded-[1.25rem] border border-dashed border-white/10 bg-black/20 px-4 py-4 text-ivory/60"
              />
            </label>
            {form.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {form.images.map((image) => (
                  <img key={image} src={imageUrl(image)} alt="Product" className="h-20 w-full rounded-xl object-cover" />
                ))}
              </div>
            )}
          </div>
          <button type="submit" disabled={saving} className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-gold bg-gold px-6 py-4 text-sm font-bold uppercase tracking-[0.25em] text-black hover:bg-transparent hover:text-gold disabled:opacity-50">
            {saving ? 'Saving...' : form.id ? 'Update Product' : 'Create Product'}
          </button>
        </form>

        <div className="space-y-8">
          <div className="glass-panel rounded-[2rem] p-8">
            <h2 className="font-display text-3xl uppercase text-ivory">Products</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {products.map((product) => (
                <div key={product._id} className="rounded-[1.5rem] border border-white/5 bg-black/20 p-4">
                  {product.images?.[0] ? (
                    <img src={imageUrl(product.images[0])} alt={product.name} className="h-40 w-full rounded-[1.25rem] object-cover" />
                  ) : (
                    <div className="h-40 rounded-[1.25rem] bg-gradient-to-br from-graphite to-black" />
                  )}
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-2xl uppercase text-ivory">{product.name}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.25em] text-gold">{product.category}</p>
                    </div>
                    <p className="text-sm font-bold uppercase tracking-[0.15em] text-ivory">{formatCurrency(product.price)}</p>
                  </div>
                  <div className="mt-5 flex gap-3">
                    <button type="button" onClick={() => handleEdit(product)} className="flex-1 rounded-full border border-gold/30 px-4 py-3 text-xs uppercase tracking-[0.25em] text-gold hover:bg-gold hover:text-black">
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(product._id)} className="flex-1 rounded-full border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.25em] text-ivory/60 hover:border-red-500 hover:text-red-400">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-display text-3xl uppercase text-ivory">Orders</h2>
              <select
                value={paymentFilter}
                onChange={(event) => setPaymentFilter(event.target.value)}
                className="rounded-full border border-white/10 bg-black/40 px-4 py-3 text-xs uppercase tracking-[0.22em] text-ivory"
              >
                <option value="">All Payment Methods</option>
                <option value="SSLCommerz">SSLCommerz</option>
                <option value="COD">COD</option>
              </select>
            </div>

            <div className="mt-6 space-y-4">
              {orders.length === 0 ? (
                <div className="rounded-[1.5rem] border border-white/5 bg-black/20 p-6 text-ivory/60">No orders found.</div>
              ) : (
                orders.map((order) => (
                  <div key={order._id} className="rounded-[1.5rem] border border-white/5 bg-black/20 p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-gold">{formatDate(order.createdAt)}</p>
                        <p className="mt-2 font-display text-2xl uppercase text-ivory">{order.user?.name || 'Customer'}</p>
                        <p className="mt-1 text-sm text-ivory/55">{order.user?.email}</p>
                      </div>

                      <div className="text-sm uppercase tracking-[0.15em] text-ivory/70">
                        <p>Total: {formatCurrency(order.totalPrice)}</p>
                        <p>Method: {order.paymentMethod}</p>
                        <p>Status: {order.paymentStatus}</p>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <select
                          value={order.orderStatus}
                          onChange={(event) => handleOrderStatusChange(order._id, event.target.value)}
                          className="rounded-full border border-white/10 bg-black/40 px-4 py-3 text-xs uppercase tracking-[0.22em] text-ivory"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        {order.paymentMethod === 'COD' && order.paymentStatus !== 'Paid' && (
                          <button
                            type="button"
                            onClick={() => handleMarkCodPaid(order._id)}
                            className="rounded-full border border-gold/30 px-4 py-3 text-xs uppercase tracking-[0.22em] text-gold hover:bg-gold hover:text-black"
                          >
                            Mark COD Paid
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminPage;

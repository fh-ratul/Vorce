import axios from 'axios';

const liveApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

liveApi.interceptors.request.use((config) => {
  const storedAuth = localStorage.getItem('vorce-auth');

  if (storedAuth) {
    const parsed = JSON.parse(storedAuth);

    if (parsed?.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }

  return config;
});

const isGithubPages = typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');
const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true' || isGithubPages;

const DEMO_KEYS = {
  users: 'vorce-demo-users',
  products: 'vorce-demo-products',
  carts: 'vorce-demo-carts',
  orders: 'vorce-demo-orders',
};

const defaultProducts = [
  {
    _id: 'p1',
    name: 'Blackout Combat Shirt',
    description: 'High-density cotton blend with reinforced seams. Engineered for presence.',
    price: 84,
    category: 'Shirts',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 45,
    badge: 'New Drop',
    featured: true,
    images: ['/media/images/hood-1.avif', '/media/images/hood-2.avif'],
  },
  {
    _id: 'p2',
    name: 'Midnight Tailored Jacket',
    description: 'Sharp tailoring with aggressive cut. Statement piece for boardroom dominance.',
    price: 89,
    category: 'Jackets',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 22,
    badge: 'Limited',
    featured: true,
    images: ['/media/images/hood-3.avif', '/media/images/hood-4.avif'],
  },
  {
    _id: 'p3',
    name: 'Obsidian Chinos',
    description: 'Premium blend with perfect drape. All-black approach to refined menswear.',
    price: 82,
    category: 'Pants',
    sizes: ['28', '30', '32', '34', '36', '38'],
    stock: 67,
    badge: null,
    featured: true,
    images: ['/media/images/hood-5.avif'],
  },
  {
    _id: 'p4',
    name: 'Gold-Trimmed Crew Neck',
    description: 'Minimalist silhouette with gold accent threading. Luxury without noise.',
    price: 87,
    category: 'Shirts',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 38,
    badge: 'New Drop',
    featured: true,
    images: ['/media/images/hood-6.avif'],
  },
  {
    _id: 'p5',
    name: 'Charcoal Utility Vest',
    description: 'Functional design meets high-end construction. Engineered layers.',
    price: 90,
    category: 'Outerwear',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 18,
    badge: 'Limited',
    featured: false,
    images: ['/media/images/hood-7.avif'],
  },
  {
    _id: 'p6',
    name: 'Black Silk Pocket Tee',
    description: 'Subtle luxury with silk finish. Refined basics for the discerning.',
    price: 81,
    category: 'Shirts',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 82,
    badge: null,
    featured: false,
    images: ['/media/images/hood-8.avif'],
  },
  {
    _id: 'p7',
    name: 'Charcoal Wool Coat',
    description: 'Italian wool with structured shoulders. Authority in every thread.',
    price: 88,
    category: 'Outerwear',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 12,
    badge: 'New Drop',
    featured: false,
    images: ['/media/images/hood-9.avif'],
  },
  {
    _id: 'p8',
    name: 'Minimalist Black Jeans',
    description: 'Raw denim with clean lines. Cut for forward movement.',
    price: 85,
    category: 'Pants',
    sizes: ['28', '30', '32', '34', '36', '38'],
    stock: 54,
    badge: null,
    featured: true,
    images: ['/media/images/hood-10.avif'],
  },
];

const defaultUsers = [
  {
    _id: 'u-admin',
    name: 'VORCE Admin',
    email: 'admin@vorce.com',
    password: 'admin123',
    role: 'admin',
    address: {
      line1: 'HQ 17',
      line2: '',
      city: 'Dhaka',
      state: 'Dhaka',
      postalCode: '1207',
      country: 'Bangladesh',
    },
  },
];

const parseJSON = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const load = (key, fallback) => parseJSON(localStorage.getItem(key), fallback);

const save = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const ensureSeed = () => {
  if (!localStorage.getItem(DEMO_KEYS.products)) {
    save(DEMO_KEYS.products, defaultProducts);
  }

  if (!localStorage.getItem(DEMO_KEYS.users)) {
    save(DEMO_KEYS.users, defaultUsers);
  }

  if (!localStorage.getItem(DEMO_KEYS.carts)) {
    save(DEMO_KEYS.carts, {});
  }

  if (!localStorage.getItem(DEMO_KEYS.orders)) {
    save(DEMO_KEYS.orders, []);
  }
};

const createApiError = (message, status = 400) => {
  const error = new Error(message);
  error.response = { status, data: { message } };
  return error;
};

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  address: user.address || {},
});

const getStoredAuth = () => parseJSON(localStorage.getItem('vorce-auth'), null);

const getCurrentUser = () => {
  const auth = getStoredAuth();

  if (!auth?.token) {
    return null;
  }

  const userId = auth.token.replace('demo-token-', '');
  const users = load(DEMO_KEYS.users, []);
  return users.find((user) => user._id === userId) || null;
};

const requireUser = () => {
  const user = getCurrentUser();

  if (!user) {
    throw createApiError('Not authorized', 401);
  }

  return user;
};

const requireAdmin = () => {
  const user = requireUser();

  if (user.role !== 'admin') {
    throw createApiError('Admin access required', 403);
  }

  return user;
};

const buildCartSummary = (userId) => {
  const carts = load(DEMO_KEYS.carts, {});
  const items = carts[userId] || [];

  return {
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };
};

const nextId = (prefix) => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

const resolveProducts = (params = {}) => {
  const products = load(DEMO_KEYS.products, []);
  const searchTerm = (params.search || '').trim().toLowerCase();

  const filtered = products.filter((product) => {
    if (searchTerm) {
      const haystack = `${product.name} ${product.description} ${product.category}`.toLowerCase();
      if (!haystack.includes(searchTerm)) {
        return false;
      }
    }

    if (params.category && product.category !== params.category) {
      return false;
    }

    if (params.size && !product.sizes.includes(params.size)) {
      return false;
    }

    const minPrice = Number(params.minPrice);
    if (params.minPrice && !Number.isNaN(minPrice) && product.price < minPrice) {
      return false;
    }

    const maxPrice = Number(params.maxPrice);
    if (params.maxPrice && !Number.isNaN(maxPrice) && product.price > maxPrice) {
      return false;
    }

    return true;
  });

  const categories = [...new Set(products.map((product) => product.category))];
  const sizes = [...new Set(products.flatMap((product) => product.sizes))];

  return {
    products: filtered,
    filters: { categories, sizes },
  };
};

const createOrder = ({ paymentMethod, shippingAddress, paymentStatus }) => {
  const user = requireUser();
  const cart = buildCartSummary(user._id);

  if (cart.items.length === 0) {
    throw createApiError('Your cart is empty', 400);
  }

  const orders = load(DEMO_KEYS.orders, []);
  const order = {
    _id: nextId('ord'),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    items: cart.items.map((item) => ({
      product: item.product,
      name: item.name,
      image: item.image,
      price: item.price,
      size: item.size,
      quantity: item.quantity,
    })),
    totalPrice: cart.subtotal,
    paymentMethod,
    paymentStatus,
    orderStatus: 'Processing',
    shippingAddress,
    createdAt: new Date().toISOString(),
  };

  orders.unshift(order);
  save(DEMO_KEYS.orders, orders);

  const carts = load(DEMO_KEYS.carts, {});
  carts[user._id] = [];
  save(DEMO_KEYS.carts, carts);

  return order;
};

const appUrl = (path) => {
  if (isGithubPages) {
    return `${window.location.origin}${import.meta.env.BASE_URL}#${path}`;
  }

  return `${window.location.origin}${path}`;
};

const demoApi = {
  async get(url, config = {}) {
    ensureSeed();

    if (url === '/auth/me') {
      const user = requireUser();
      return { data: publicUser(user) };
    }

    if (url === '/products') {
      return { data: resolveProducts(config.params || {}) };
    }

    if (url === '/products/featured') {
      const products = load(DEMO_KEYS.products, []);
      return { data: products.filter((product) => product.featured) };
    }

    if (url.startsWith('/products/')) {
      const productId = url.split('/').pop();
      const products = load(DEMO_KEYS.products, []);
      const product = products.find((item) => item._id === productId);

      if (!product) {
        throw createApiError('Product not found', 404);
      }

      return { data: product };
    }

    if (url === '/cart') {
      const user = requireUser();
      return { data: buildCartSummary(user._id) };
    }

    if (url === '/orders/mine') {
      const user = requireUser();
      const orders = load(DEMO_KEYS.orders, []).filter((order) => order.user?._id === user._id);
      return { data: orders };
    }

    if (url.startsWith('/orders/')) {
      const user = requireUser();
      const orderId = url.split('/').pop();
      const orders = load(DEMO_KEYS.orders, []);
      const order = orders.find((item) => item._id === orderId);

      if (!order) {
        throw createApiError('Order not found', 404);
      }

      if (user.role !== 'admin' && order.user?._id !== user._id) {
        throw createApiError('Not authorized', 403);
      }

      return { data: order };
    }

    if (url === '/admin/dashboard') {
      requireAdmin();
      const orders = load(DEMO_KEYS.orders, []);
      const products = load(DEMO_KEYS.products, []);
      return {
        data: {
          totalOrders: orders.length,
          totalRevenue: orders.reduce((sum, order) => sum + order.totalPrice, 0),
          productCount: products.length,
        },
      };
    }

    if (url === '/admin/orders') {
      requireAdmin();
      const paymentMethod = config.params?.paymentMethod;
      let orders = load(DEMO_KEYS.orders, []);

      if (paymentMethod) {
        orders = orders.filter((order) => order.paymentMethod === paymentMethod);
      }

      return { data: orders };
    }

    throw createApiError('Endpoint not implemented in demo mode', 404);
  },

  async post(url, payload) {
    ensureSeed();

    if (url === '/auth/register') {
      const users = load(DEMO_KEYS.users, []);
      const email = payload.email.trim().toLowerCase();
      const existing = users.find((user) => user.email.toLowerCase() === email);

      if (existing) {
        throw createApiError('Email already in use', 409);
      }

      const user = {
        _id: nextId('usr'),
        name: payload.name,
        email,
        password: payload.password,
        role: 'customer',
        address: {},
      };

      users.push(user);
      save(DEMO_KEYS.users, users);

      return {
        data: {
          ...publicUser(user),
          token: `demo-token-${user._id}`,
        },
      };
    }

    if (url === '/auth/login') {
      const users = load(DEMO_KEYS.users, []);
      const email = payload.email.trim().toLowerCase();
      const user = users.find((item) => item.email.toLowerCase() === email && item.password === payload.password);

      if (!user) {
        throw createApiError('Invalid email or password', 401);
      }

      return {
        data: {
          ...publicUser(user),
          token: `demo-token-${user._id}`,
        },
      };
    }

    if (url === '/cart/items') {
      const user = requireUser();
      const products = load(DEMO_KEYS.products, []);
      const product = products.find((item) => item._id === payload.productId);

      if (!product) {
        throw createApiError('Product not found', 404);
      }

      const quantity = Math.max(1, Number(payload.quantity) || 1);
      const size = payload.size || product.sizes?.[0] || 'M';
      const carts = load(DEMO_KEYS.carts, {});
      const items = carts[user._id] || [];
      const existing = items.find((item) => item.product === product._id && item.size === size);

      if (existing) {
        existing.quantity += quantity;
      } else {
        items.push({
          _id: nextId('cartitem'),
          product: product._id,
          name: product.name,
          image: product.images?.[0] || '',
          price: product.price,
          size,
          quantity,
        });
      }

      carts[user._id] = items;
      save(DEMO_KEYS.carts, carts);
      return { data: buildCartSummary(user._id) };
    }

    if (url === '/payment/init') {
      const order = createOrder({
        paymentMethod: 'SSLCommerz',
        shippingAddress: payload.shippingAddress,
        paymentStatus: 'Paid',
      });

      return {
        data: {
          url: appUrl(`/order-confirmation?order_id=${order._id}&payment=success`),
        },
      };
    }

    if (url === '/payment/cod') {
      const order = createOrder({
        paymentMethod: 'COD',
        shippingAddress: payload.shippingAddress,
        paymentStatus: 'Pending',
      });

      return { data: order };
    }

    if (url === '/upload/images') {
      requireAdmin();
      const fallback = [
        '/media/images/hood-1.avif',
        '/media/images/hood-2.avif',
        '/media/images/hood-3.avif',
        '/media/images/hood-4.avif',
      ];
      const files = payload?.getAll ? payload.getAll('images') : [];
      const images = files.length ? files.map((_, index) => fallback[index % fallback.length]) : [fallback[0]];
      return { data: { images } };
    }

    if (url === '/admin/products') {
      requireAdmin();
      const products = load(DEMO_KEYS.products, []);
      const product = {
        _id: nextId('p'),
        name: payload.name,
        description: payload.description,
        price: Number(payload.price),
        category: payload.category,
        sizes: payload.sizes || [],
        stock: Number(payload.stock),
        badge: payload.badge || null,
        featured: Boolean(payload.featured),
        images: payload.images || [],
      };

      products.unshift(product);
      save(DEMO_KEYS.products, products);
      return { data: product };
    }

    throw createApiError('Endpoint not implemented in demo mode', 404);
  },

  async put(url, payload) {
    ensureSeed();

    if (url === '/users/profile') {
      const user = requireUser();
      const users = load(DEMO_KEYS.users, []);
      const index = users.findIndex((item) => item._id === user._id);

      if (index === -1) {
        throw createApiError('User not found', 404);
      }

      users[index] = {
        ...users[index],
        name: payload.name ?? users[index].name,
        email: payload.email ?? users[index].email,
        address: payload.address ?? users[index].address,
        password: payload.password ? payload.password : users[index].password,
      };

      save(DEMO_KEYS.users, users);
      return {
        data: {
          ...publicUser(users[index]),
          token: `demo-token-${users[index]._id}`,
        },
      };
    }

    if (url.startsWith('/cart/items/')) {
      const user = requireUser();
      const itemId = url.split('/').pop();
      const carts = load(DEMO_KEYS.carts, {});
      const items = carts[user._id] || [];
      const target = items.find((item) => item._id === itemId);

      if (!target) {
        throw createApiError('Cart item not found', 404);
      }

      target.quantity = Math.max(1, Number(payload.quantity) || 1);
      carts[user._id] = items;
      save(DEMO_KEYS.carts, carts);

      return { data: buildCartSummary(user._id) };
    }

    if (url.startsWith('/admin/products/')) {
      requireAdmin();
      const productId = url.split('/').pop();
      const products = load(DEMO_KEYS.products, []);
      const index = products.findIndex((item) => item._id === productId);

      if (index === -1) {
        throw createApiError('Product not found', 404);
      }

      products[index] = {
        ...products[index],
        ...payload,
        price: Number(payload.price),
        stock: Number(payload.stock),
      };

      save(DEMO_KEYS.products, products);
      return { data: products[index] };
    }

    if (url.startsWith('/admin/orders/') && url.endsWith('/status')) {
      requireAdmin();
      const parts = url.split('/');
      const orderId = parts[3];
      const orders = load(DEMO_KEYS.orders, []);
      const index = orders.findIndex((item) => item._id === orderId);

      if (index === -1) {
        throw createApiError('Order not found', 404);
      }

      orders[index] = {
        ...orders[index],
        ...(payload.orderStatus ? { orderStatus: payload.orderStatus } : {}),
        ...(payload.paymentStatus ? { paymentStatus: payload.paymentStatus } : {}),
      };

      save(DEMO_KEYS.orders, orders);
      return { data: orders[index] };
    }

    throw createApiError('Endpoint not implemented in demo mode', 404);
  },

  async delete(url) {
    ensureSeed();

    if (url.startsWith('/cart/items/')) {
      const user = requireUser();
      const itemId = url.split('/').pop();
      const carts = load(DEMO_KEYS.carts, {});
      const items = (carts[user._id] || []).filter((item) => item._id !== itemId);
      carts[user._id] = items;
      save(DEMO_KEYS.carts, carts);

      return { data: buildCartSummary(user._id) };
    }

    if (url.startsWith('/admin/products/')) {
      requireAdmin();
      const productId = url.split('/').pop();
      const products = load(DEMO_KEYS.products, []);
      const nextProducts = products.filter((item) => item._id !== productId);
      save(DEMO_KEYS.products, nextProducts);
      return { data: { success: true } };
    }

    throw createApiError('Endpoint not implemented in demo mode', 404);
  },
};

const api = isDemoMode ? demoApi : liveApi;

export default api;

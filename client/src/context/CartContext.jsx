import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], itemCount: 0, subtotal: 0 });
  const [loading, setLoading] = useState(false);

  const refreshCart = async () => {
    if (!user?.token) {
      setCart({ items: [], itemCount: 0, subtotal: 0 });
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.get('/cart');
      setCart(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user?.token]);

  const addToCart = async (payload) => {
    const { data } = await api.post('/cart/items', payload);
    setCart(data);
    toast.success('Added to cart');
  };

  const updateCartItem = async (itemId, payload) => {
    const { data } = await api.put(`/cart/items/${itemId}`, payload);
    setCart(data);
  };

  const removeCartItem = async (itemId) => {
    const { data } = await api.delete(`/cart/items/${itemId}`);
    setCart(data);
    toast.success('Item removed');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        refreshCart,
        addToCart,
        updateCartItem,
        removeCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

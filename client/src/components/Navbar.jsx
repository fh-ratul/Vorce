import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, ShoppingBag, User, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

const navLinkClass = ({ isActive }) =>
  `text-sm uppercase tracking-[0.25em] ${isActive ? 'text-gold' : 'text-ivory/70 hover:text-ivory'}`;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gold/10 bg-obsidian/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to={isAdmin ? '/admin' : '/'} className="font-display text-3xl uppercase tracking-[0.35em] text-ivory">
          VORCE
        </Link>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-gold/20 p-2 text-ivory md:hidden"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>

        <nav
          className={`${
            open ? 'flex' : 'hidden'
          } absolute left-0 top-full w-full flex-col gap-6 border-b border-gold/10 bg-black px-4 py-6 md:static md:flex md:w-auto md:flex-row md:items-center md:border-none md:bg-transparent md:p-0`}
        >
          {!isAdmin && (
            <>
              <NavLink to="/shop" className={navLinkClass}>
                Shop
              </NavLink>
              {user && (
                <NavLink to="/dashboard" className={navLinkClass}>
                  Dashboard
                </NavLink>
              )}
            </>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}
          {!user ? (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={navLinkClass}>
                Register
              </NavLink>
            </>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm uppercase tracking-[0.25em] text-ivory/70 hover:text-ivory"
            >
              Logout
            </button>
          )}
          <div className="flex items-center gap-3 md:ml-6">
            <Link to={isAdmin ? '/admin' : '/dashboard'} className="rounded-full border border-gold/20 p-2 text-ivory/80 hover:border-gold hover:text-gold">
              <User size={18} />
            </Link>
            {!isAdmin && (
              <Link to="/cart" className="relative rounded-full border border-gold/20 p-2 text-ivory/80 hover:border-gold hover:text-gold">
              <ShoppingBag size={18} />
              {cart.itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-black">
                  {cart.itemCount}
                </span>
              )}
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

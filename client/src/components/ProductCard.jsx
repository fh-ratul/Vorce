import { Link } from 'react-router-dom';
import { formatCurrency, imageUrl } from '../lib/format';

const badgeStyles = {
  'New Drop': 'bg-gold text-black',
  Limited: 'bg-white text-black',
};

const ProductCard = ({ product }) => (
  <Link
    to={`/product/${product._id}`}
    className="group luxury-border glass-panel relative overflow-hidden rounded-[1.75rem] p-4 transition duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-glow"
  >
    <div className="relative overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-graphite to-black">
      {product.badge && (
        <span className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] ${badgeStyles[product.badge]}`}>
          {product.badge}
        </span>
      )}
      {product.images?.[0] ? (
        <img
          src={imageUrl(product.images[0])}
          alt={product.name}
          className="h-80 w-full object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-90"
        />
      ) : (
        <div className="h-80 w-full bg-[radial-gradient(circle_at_top,rgba(200,169,107,0.2),transparent_28%),linear-gradient(180deg,#1a1a1a_0%,#060606_100%)]" />
      )}
    </div>
    <div className="pt-5">
      <p className="text-xs uppercase tracking-[0.35em] text-gold/70">{product.category}</p>
      <div className="mt-2 flex items-start justify-between gap-4">
        <h3 className="font-display text-2xl uppercase leading-tight text-ivory">{product.name}</h3>
        <span className="text-sm font-bold uppercase tracking-[0.15em] text-ivory">{formatCurrency(product.price)}</span>
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-ivory/60">{product.description}</p>
    </div>
  </Link>
);

export default ProductCard;

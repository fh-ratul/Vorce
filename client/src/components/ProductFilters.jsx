const ProductFilters = ({ filters, options, onChange, onReset }) => (
  <aside className="glass-panel rounded-[1.75rem] p-6">
    <div className="mb-6 flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-gold">Refine</p>
        <h2 className="mt-2 font-display text-3xl uppercase text-ivory">Selection</h2>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="text-xs uppercase tracking-[0.25em] text-ivory/60 hover:text-gold"
      >
        Reset
      </button>
    </div>

    <div className="space-y-5">
      <label className="block text-sm uppercase tracking-[0.18em] text-ivory/60">
        Search
        <input
          type="text"
          value={filters.search}
          onChange={(event) => onChange('search', event.target.value)}
          placeholder="Search the drop"
          className="mt-2 w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-ivory placeholder:text-ivory/30"
        />
      </label>

      <label className="block text-sm uppercase tracking-[0.18em] text-ivory/60">
        Category
        <select
          value={filters.category}
          onChange={(event) => onChange('category', event.target.value)}
          className="mt-2 w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-ivory"
        >
          <option value="">All categories</option>
          {options.categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm uppercase tracking-[0.18em] text-ivory/60">
        Size
        <select
          value={filters.size}
          onChange={(event) => onChange('size', event.target.value)}
          className="mt-2 w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-ivory"
        >
          <option value="">All sizes</option>
          {options.sizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm uppercase tracking-[0.18em] text-ivory/60">
          Min price
          <input
            type="number"
            min="0"
            value={filters.minPrice}
            onChange={(event) => onChange('minPrice', event.target.value)}
            className="mt-2 w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-ivory"
          />
        </label>
        <label className="block text-sm uppercase tracking-[0.18em] text-ivory/60">
          Max price
          <input
            type="number"
            min="0"
            value={filters.maxPrice}
            onChange={(event) => onChange('maxPrice', event.target.value)}
            className="mt-2 w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-ivory"
          />
        </label>
      </div>
    </div>
  </aside>
);

export default ProductFilters;

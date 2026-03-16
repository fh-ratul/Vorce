const LoadingSpinner = ({ fullScreen = false }) => (
  <div className={fullScreen ? 'flex min-h-screen items-center justify-center' : 'flex items-center justify-center py-16'}>
    <div className="flex items-center gap-3 text-sm uppercase tracking-[0.35em] text-gold">
      <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />
      Loading
    </div>
  </div>
);

export default LoadingSpinner;

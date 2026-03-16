export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

export const formatDate = (value) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));

export const imageUrl = (path) => {
  if (!path) {
    return '';
  }

  if (path.startsWith('http')) {
    return path;
  }

  return `${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}${path}`;
};

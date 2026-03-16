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

  const isGithubPages = typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');

  if (isGithubPages) {
    const normalized = path.startsWith('/') ? path.slice(1) : path;
    return `${import.meta.env.BASE_URL}${normalized}`;
  }

  const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
  return path.startsWith('/') ? `${serverUrl}${path}` : `${serverUrl}/${path}`;
};

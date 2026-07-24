const getApiEndpoint = (): string => {
  const rawUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_ENDPOINT || 'http://localhost:6001';
  const cleanUrl = rawUrl.replace(/\/+$/, '');
  return cleanUrl.endsWith('/api/v1') ? cleanUrl : `${cleanUrl}/api/v1`;
};

export const ENV = {
  END_POINT: getApiEndpoint(),
} as const;


/** Base URL de l’API (sans /api). Surchargé en prod par REACT_APP_API_URL (build CD). */
export function getApiBaseUrl(): string {
  const root = (process.env.REACT_APP_API_URL || 'http://localhost:3000').replace(/\/$/, '');
  return `${root}/api`;
}

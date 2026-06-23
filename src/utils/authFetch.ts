import { getAccessToken } from './tokenStorage';

/**
 * Drop-in replacement for fetch() that attaches the stored access token.
 * Use this for any request that hits a route behind JwtAuthGuard on the backend
 * (posts, comments, conversations, rewards, etc). Login and register don't need
 * this since there's no token yet at that point.
 */
export async function authFetch(url: string, options: RequestInit = {}) {
  const token = await getAccessToken();

  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}

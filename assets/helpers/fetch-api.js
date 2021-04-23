import { URL_TRANSLATE_GOOGLEAPI } from '../constants/api';

const fetcher = (uri, options) => {
  const baseUrl = URL_TRANSLATE_GOOGLEAPI;
  const url = uri.startsWith('/') ? baseUrl + uri : uri;
  options.headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  return fetch(url, options)
    .then(response => {
      return response.ok ? response.json() : null;
    });
}

const fetchApi = {
  get: (uri, params = [], headers = {}) => {
    let esc = encodeURIComponent;
    let query = Object.keys(params)
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&');
    return fetcher(`${uri}?${query}`, {headers});
  },
  post: (uri, data = [], headers = {}) => {
    return fetcher(uri, {
      method: 'POST',
      body: JSON.stringify(data),
      headers,
    });
  },
  put: (uri, data = [], headers = {}) => {
    return fetcher(uri, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers,
    });
  },
  delete: (uri, data = [], headers = {}) => {
    return fetcher(uri, {
      method: 'DELETE',
      body: JSON.stringify(data),
      headers,
    });
  },
}

export default fetchApi;

const DEFAULT_DEV_API_URL = "http://localhost:5000";
const LOCAL_API_PATTERN = /^https?:\/\/localhost:5000/i;

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

export const API_URL = trimTrailingSlash(
  import.meta.env.VITE_API_URL || (import.meta.env.DEV ? DEFAULT_DEV_API_URL : "")
);

export const API_BASE_URL = API_URL ? `${API_URL}/api` : "/api";
export const GOOGLE_AUTH_URL = API_URL
  ? `${API_URL}/api/auth/google`
  : "/api/auth/google";

export const buildApiUrl = (path = "") => {
  if (!path) {
    return API_BASE_URL;
  }

  if (/^https?:\/\//i.test(path)) {
    return rewriteApiUrl(path);
  }

  const normalizedPath = path.startsWith("/api") ? path.slice(4) : path;

  if (API_URL) {
    return `${API_BASE_URL}${normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`}`;
  }

  return normalizedPath.startsWith("/") ? `/api${normalizedPath}` : `/api/${normalizedPath}`;
};

export const rewriteApiUrl = (url) => {
  if (typeof url !== "string" || !url) {
    return url;
  }

  if (LOCAL_API_PATTERN.test(url)) {
    return `${API_URL || DEFAULT_DEV_API_URL}${url.replace(LOCAL_API_PATTERN, "")}`;
  }

  if (url.startsWith("/api")) {
    return API_URL ? `${API_URL}${url}` : url;
  }

  return url;
};

const POSTHOG_API_KEY = "phc_mWJMPvwccYnAArBrZ8o9jQfCU6pRpEe6S9Fw9tW5urHH";
const POSTHOG_INGEST_HOST = "https://us.i.posthog.com";
const DISTINCT_ID_KEY = "docusphere_analytics_distinct_id";
const SESSION_ID_KEY = "docusphere_analytics_session_id";

let initialized = false;
let identifiedUserId = null;

const canUseBrowserStorage = () => typeof window !== "undefined" && window.localStorage && window.sessionStorage;

const createId = () => {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const getOrCreateStorageValue = (storage, key) => {
  let value = storage.getItem(key);
  if (!value) {
    value = createId();
    storage.setItem(key, value);
  }
  return value;
};

const getAnonymousDistinctId = () => {
  if (!canUseBrowserStorage()) return null;
  return getOrCreateStorageValue(window.localStorage, DISTINCT_ID_KEY);
};

const getSessionId = () => {
  if (!canUseBrowserStorage()) return null;
  return getOrCreateStorageValue(window.sessionStorage, SESSION_ID_KEY);
};

const compactProperties = (properties) => {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
};

const sendCapture = (event, properties = {}, distinctId = getAnonymousDistinctId()) => {
  if (typeof window === "undefined" || !POSTHOG_API_KEY || !POSTHOG_INGEST_HOST || !distinctId) {
    return;
  }

  const payload = {
    api_key: POSTHOG_API_KEY,
    event,
    properties: compactProperties({
      distinct_id: distinctId,
      app: "docusphere",
      session_id: getSessionId(),
      ...properties
    })
  };

  window
    .fetch(`${POSTHOG_INGEST_HOST}/capture/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true
    })
    .catch(() => {});
};

export const initAnalytics = () => {
  if (initialized || !canUseBrowserStorage()) return;
  getAnonymousDistinctId();
  getSessionId();
  initialized = true;
};

export const getRouteName = (pathname) => {
  if (pathname === "/" || pathname === "/login") return "login";
  if (pathname === "/signup") return "signup";
  if (pathname === "/forgot-password") return "forgot_password";
  if (pathname === "/dashboard") return "dashboard";
  if (pathname === "/upload") return "upload";
  if (pathname === "/documents") return "documents";
  if (pathname === "/trash") return "trash";
  if (pathname === "/profile") return "profile";
  if (pathname.startsWith("/doc/")) return "shared_document";
  if (pathname.startsWith("/u/")) return "public_portfolio";
  return "unknown";
};

export const trackPageView = (routeName) => {
  initAnalytics();
  sendCapture("$pageview", { route: routeName });
};

export const trackEvent = (event, properties = {}) => {
  initAnalytics();
  sendCapture(event, properties);
};

export const identifyUser = (userId) => {
  if (!userId || !canUseBrowserStorage()) return;

  const anonymousDistinctId = getAnonymousDistinctId();
  const distinctId = String(userId);
  window.localStorage.setItem(DISTINCT_ID_KEY, distinctId);
  identifiedUserId = distinctId;

  sendCapture("$identify", { $anon_distinct_id: anonymousDistinctId }, distinctId);
};

export const identifyUserFromToken = (token) => {
  if (!token || typeof window === "undefined") return;

  try {
    const userId = JSON.parse(window.atob(token.split(".")[1]))?.id;
    if (userId && identifiedUserId !== String(userId)) {
      identifyUser(userId);
    }
  } catch {
    return;
  }
};

export const resetAnalyticsIdentity = () => {
  if (!canUseBrowserStorage()) return;
  identifiedUserId = null;
  window.localStorage.removeItem(DISTINCT_ID_KEY);
  window.sessionStorage.removeItem(SESSION_ID_KEY);
};

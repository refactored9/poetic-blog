// Service Worker for The Solo Akash
const CACHE_NAME = 'poetic-blog-v1';
const STATIC_CACHE_NAME = 'poetic-blog-static-v1';
const DYNAMIC_CACHE_NAME = 'poetic-blog-dynamic-v1';

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/about',
  '/journeys',
  '/offline',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => {
          return new Request(url, { credentials: 'same-origin' });
        })).catch(err => {
          console.log('[SW] Some static assets failed to cache:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              return name.startsWith('poetic-blog-') &&
                     name !== STATIC_CACHE_NAME &&
                     name !== DYNAMIC_CACHE_NAME;
            })
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip API requests - always fetch from network
  if (url.pathname.startsWith('/api')) {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful navigation responses
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(DYNAMIC_CACHE_NAME)
              .then((cache) => cache.put(request, responseToCache));
          }
          return response;
        })
        .catch(() => {
          // Return cached version or offline page
          return caches.match(request)
            .then((cached) => {
              if (cached) return cached;
              return caches.match('/offline')
                .then((offline) => offline || new Response('Offline', {
                  status: 503,
                  statusText: 'Service Unavailable'
                }));
            });
        })
    );
    return;
  }

  // Handle static assets (images, fonts, css, js)
  if (
    url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|css|js)$/) ||
    url.pathname.startsWith('/_next/static')
  ) {
    event.respondWith(
      caches.match(request)
        .then((cached) => {
          if (cached) {
            // Return cached, but also update cache in background
            fetch(request)
              .then((response) => {
                if (response.ok) {
                  caches.open(STATIC_CACHE_NAME)
                    .then((cache) => cache.put(request, response));
                }
              })
              .catch(() => {});
            return cached;
          }

          // Not in cache - fetch and cache
          return fetch(request)
            .then((response) => {
              if (response.ok) {
                const responseToCache = response.clone();
                caches.open(STATIC_CACHE_NAME)
                  .then((cache) => cache.put(request, responseToCache));
              }
              return response;
            });
        })
    );
    return;
  }

  // Default strategy - network first, cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE_NAME)
            .then((cache) => cache.put(request, responseToCache));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // Cache specific pages on demand (like reading list items)
  if (event.data && event.data.type === 'CACHE_PAGES') {
    const urls = event.data.urls || [];
    caches.open(DYNAMIC_CACHE_NAME)
      .then((cache) => {
        urls.forEach((url) => {
          fetch(url)
            .then((response) => {
              if (response.ok) {
                cache.put(url, response);
              }
            })
            .catch(() => {});
        });
      });
  }
});

// Background sync for pending actions (future use)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-reading-list') {
    // Sync reading list when back online
    console.log('[SW] Syncing reading list...');
  }
});

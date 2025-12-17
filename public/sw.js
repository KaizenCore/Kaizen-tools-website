const CACHE_NAME = 'kaizen-tools-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
    '/',
    '/manifest.json',
    '/favicon.ico',
    '/favicon.svg',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/tools',
];

// Tools that work offline (no external API calls)
const OFFLINE_TOOLS = [
    '/tools/nether-calculator',
    '/tools/xp-calculator',
    '/tools/redstone-calculator',
    '/tools/coordinate-calculator',
    '/tools/color-codes',
    '/tools/enchantment-calculator',
    '/tools/potion-brewing',
    '/tools/mob-spawning',
    '/tools/biome-guide',
    '/tools/crafting-recipes',
    '/tools/villager-trading',
    '/tools/tellraw-generator',
    '/tools/bossbar-generator',
    '/tools/scoreboard-generator',
    '/tools/team-generator',
    '/tools/effect-generator',
    '/tools/particle-generator',
    '/tools/entity-generator',
    '/tools/item-generator',
    '/tools/execute-generator',
    '/tools/fill-clone-generator',
    '/tools/target-selector-generator',
    '/tools/advancement-generator',
    '/tools/loot-table-generator',
    '/tools/recipe-generator',
    '/tools/sign-book-generator',
    '/tools/flat-world-generator',
    '/tools/firework-designer',
    '/tools/armor-stand-editor',
    '/tools/banner-creator',
    '/tools/command-generator',
];

// Tools that require internet connection
const ONLINE_ONLY_TOOLS = [
    '/tools/server-status',
    '/tools/uuid-converter',
    '/tools/skin-viewer',
];

// Check if a URL is an offline-capable tool
function isOfflineTool(url) {
    return OFFLINE_TOOLS.some((tool) => url.includes(tool));
}

// Install event - cache essential assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            );
        })
    );
    self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip API requests and hot module replacement
    if (
        event.request.url.includes('/api/') ||
        event.request.url.includes('/@vite') ||
        event.request.url.includes('hot')
    ) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clone the response before caching
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        // Cache static assets
                        if (
                            event.request.url.includes('/icons/') ||
                            event.request.url.includes('/build/') ||
                            event.request.url.endsWith('.css') ||
                            event.request.url.endsWith('.js')
                        ) {
                            cache.put(event.request, responseClone);
                        }
                        // Cache offline-capable tools when visited
                        if (
                            event.request.mode === 'navigate' &&
                            isOfflineTool(event.request.url)
                        ) {
                            cache.put(event.request, responseClone);
                        }
                    });
                }
                return response;
            })
            .catch(() => {
                // Return cached version if available
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // For navigation requests to offline tools, try to serve from cache
                    if (event.request.mode === 'navigate') {
                        // If it's an offline tool, it should be cached
                        if (isOfflineTool(event.request.url)) {
                            return caches.match('/tools');
                        }
                        return caches.match('/');
                    }
                    return new Response('Offline', {
                        status: 503,
                        statusText: 'Service Unavailable',
                    });
                });
            })
    );
});

// Handle push notifications (for future use)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-192x192.png',
            vibrate: [100, 50, 100],
            data: {
                url: data.url || '/',
            },
        };
        event.waitUntil(self.registration.showNotification(data.title, options));
    }
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data.url));
});

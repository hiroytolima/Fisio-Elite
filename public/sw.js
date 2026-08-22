/// <reference lib="webworker" />

const CACHE_NAME = 'fisio-elite-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.ico',
];

// Instalação: Cache estático apenas de assets de UI (HTML, CSS, JS estático)
self.addEventListener('install', (event) => {
  /** @type {ExtendableEvent} */
  const evt = /** @type {any} */ (event);
  evt.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => /** @type {any} */ (self).skipWaiting())
  );
});

// Ativação: Limpeza de caches antigos e assumir controle das páginas
self.addEventListener('activate', (event) => {
  /** @type {ExtendableEvent} */
  const evt = /** @type {any} */ (event);
  evt.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
            return Promise.resolve(true);
          })
        );
      })
      .then(() => /** @type {any} */ (self).clients.claim())
  );
});

// Interceptação de Requisições: Offline seguro com bloqueio rigoroso de dados sensíveis
self.addEventListener('fetch', (event) => {
  /** @type {FetchEvent} */
  const evt = /** @type {any} */ (event);
  const url = new URL(evt.request.url);

  // REGRA DE SEGURANÇA INEGOCIÁVEL: NUNCA armazenar em cache respostas de autenticação,
  // banco de dados Supabase, Edge Functions ou requisições não-GET.
  const isSupabaseApi =
    url.hostname.includes('supabase.co') ||
    url.pathname.startsWith('/rest/') ||
    url.pathname.startsWith('/auth/');
  const isEdgeFunction = url.pathname.startsWith('/functions/');
  const isNonGetMethod = evt.request.method !== 'GET';

  if (isSupabaseApi || isEdgeFunction || isNonGetMethod) {
    // Redireciona diretamente para a rede sem passar pelo CacheStorage
    return;
  }

  // Estratégia Stale-While-Revalidate para assets estáticos da UI
  evt.respondWith(
    caches.match(evt.request).then((cachedResponse) => {
      const fetchPromise = fetch(evt.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(evt.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise || fetch(evt.request);
    })
  );
});

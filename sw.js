// sw.js - Service Worker para PWA (Cache e Ativação)

const CACHE_NAME = 'dmx-vento-v2'; // <--- ALTERADO DE v1 PARA v2
// Lista de arquivos locais que devem ser cacheados para uso offline
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-72x72.png',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// 1. Evento 'install': Abre o cache e adiciona os arquivos essenciais
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto. Arquivos essenciais pré-carregados.');
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Falha ao adicionar ao cache:', error);
        });
      })
  );
});

// 2. Evento 'fetch': Intercepta requisições. Tenta buscar no cache primeiro (cache-first).
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// 3. Evento 'activate': Limpa caches antigos (importante para atualizações)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Limpando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
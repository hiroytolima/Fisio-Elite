/**
 * Registra o Service Worker em ambientes de produção ou preview
 * garantindo suporte offline seguro para recursos estáticos da aplicação.
 */
export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('FisioElite ServiceWorker registrado com sucesso:', registration.scope);
        })
        .catch((error) => {
          console.error('Falha ao registrar o ServiceWorker do FisioElite:', error);
        });
    });
  }
}

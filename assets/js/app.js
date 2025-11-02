// Nav highlight
(function(){
  const path = location.pathname.replace(/\/+$/,'') || '/';
  document.querySelectorAll('.site-nav a').forEach(a=>{
    const h = (a.getAttribute('href')||'').replace(/\/+$/,'') || '/';
    if (h && path===h) a.classList.add('active');
  });
})();

// Register Service Worker for PWA/offline
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(()=>{});
  });
}

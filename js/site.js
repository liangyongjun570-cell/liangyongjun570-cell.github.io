(() => {
  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      document.querySelector('#search-button > .search')?.click();
      return;
    }

    if (event.key === 'Escape') {
      document.querySelector('#local-search .search-close-button')?.click();
    }
  });

  document.addEventListener('click', (event) => {
    const anchor = event.target.closest('a[href]');
    if (!anchor || anchor.origin !== window.location.origin || anchor.hash.length < 2) return;
    const target = document.getElementById(decodeURIComponent(anchor.hash.slice(1)));
    if (!target) return;
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
})();

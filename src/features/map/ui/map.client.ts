function loadMap(button: HTMLButtonElement): void {
  const query = button.dataset.mapQuery;
  const title = button.dataset.mapTitle ?? 'Mapa';
  if (!query) return;

  const wrapper = button.closest('div');
  if (!wrapper) return;

  const iframe = document.createElement('iframe');
  iframe.src = `https://www.google.com/maps?q=${query}&output=embed`;
  iframe.title = title;
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  iframe.allowFullscreen = true;
  iframe.className = 'h-full w-full border-0';

  const container = document.createElement('div');
  container.className = 'h-[22rem] w-full bg-blue-50 sm:h-[24rem]';
  container.appendChild(iframe);

  wrapper.replaceChildren(container);
}

function bind(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-map-load]').forEach((button) => {
    button.addEventListener('click', () => loadMap(button), { once: true });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bind, { once: true });
} else {
  bind();
}

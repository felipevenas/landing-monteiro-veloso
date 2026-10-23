import { CONSENT_EVENT, getConsentState } from '@/features/consent';

declare global {
  interface Window {
    instgrm?: { Embeds?: { process?: () => void } };
  }
}

const carousel = document.querySelector<HTMLElement>('[data-instagram-carousel]');

if (carousel) {
  const track = carousel.querySelector<HTMLElement>('[data-instagram-track]');
  const note = carousel.querySelector<HTMLElement>('[data-instagram-note]');
  const previous = carousel.querySelector<HTMLButtonElement>('[data-instagram-prev]');
  const next = carousel.querySelector<HTMLButtonElement>('[data-instagram-next]');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const originalMarkup = track?.innerHTML ?? '';
  const originalNote = note?.textContent ?? '';
  let embedsRequested = false;
  let visible = false;

  function restoreFallback(): void {
    if (track) track.innerHTML = originalMarkup;
    document.querySelector('script[src*="instagram.com/embed.js"]')?.remove();
    embedsRequested = false;
    if (note) {
      note.hidden = false;
      note.textContent = originalNote;
    }
    updateControls();
  }

  function updateControls(): void {
    if (!track || !previous || !next) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    previous.disabled = track.scrollLeft <= 1;
    next.disabled = maxScroll <= 1 || track.scrollLeft >= maxScroll - 1;
  }

  function labelIframes(): void {
    if (!track) return;
    track.querySelectorAll<HTMLIFrameElement>('iframe').forEach((iframe, index) => {
      if (!iframe.title) iframe.title = `Post ${index + 1} do Instagram`;
    });
  }

  function loadEmbeds(): void {
    if (embedsRequested || getConsentState() !== 'granted') return;

    embedsRequested = true;

    if (window.instgrm?.Embeds?.process) {
      window.instgrm.Embeds.process();
      labelIframes();
      if (note) note.hidden = true;
      updateControls();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src*="instagram.com/embed.js"]',
    );
    if (existing) {
      existing.addEventListener('load', () => {
        if (getConsentState() !== 'granted') {
          restoreFallback();
          return;
        }
        window.instgrm?.Embeds?.process?.();
        labelIframes();
        if (note) note.hidden = true;
        updateControls();
      });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.addEventListener('load', () => {
      if (getConsentState() !== 'granted') {
        restoreFallback();
        return;
      }
      window.instgrm?.Embeds?.process?.();
      labelIframes();
      if (note) note.hidden = true;
      updateControls();
    });
    script.addEventListener('error', () => {
      embedsRequested = false;
      if (note) {
        note.textContent =
          'Não foi possível carregar os vídeos agora. Abra o Instagram para ver os posts.';
      }
    });
    document.body.appendChild(script);
  }

  function maybeLoad(): void {
    if (visible) loadEmbeds();
  }

  if (track) {
    const scrollStep = (): number => {
      const firstCard = track.firstElementChild as HTMLElement | null;
      return firstCard ? firstCard.getBoundingClientRect().width + 20 : 320;
    };

    const scroll = (direction: 1 | -1): void => {
      track.scrollBy({
        left: direction * scrollStep(),
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    };

    const observer = new MutationObserver(labelIframes);
    observer.observe(track, { childList: true, subtree: true });

    previous?.addEventListener('click', () => scroll(-1));
    next?.addEventListener('click', () => scroll(1));

    track.addEventListener('scroll', updateControls, { passive: true });
    track.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scroll(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        scroll(1);
      }
    });

    window.addEventListener('resize', updateControls);
    updateControls();
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        visible = true;
        maybeLoad();
        observer.disconnect();
      },
      { rootMargin: '300px' },
    );
    observer.observe(carousel);
  } else {
    visible = true;
    maybeLoad();
  }

  window.addEventListener(CONSENT_EVENT, (event) => {
    const decision = (event as CustomEvent<{ decision?: string }>).detail?.decision;
    if (decision === 'granted') {
      maybeLoad();
      return;
    }
    if (decision === 'denied' || decision === 'undecided') {
      restoreFallback();
    }
  });
}

const roots = document.querySelectorAll<HTMLElement>('[data-reviews-carousel]');

function setup(root: HTMLElement): void {
  const track = root.querySelector<HTMLElement>('[data-reviews-track]');
  const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-review-slide]'));
  const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-reviews-dot]'));
  const prev = root.querySelector<HTMLButtonElement>('[data-reviews-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-reviews-next]');
  const status = root.querySelector<HTMLElement>('[data-reviews-status]');

  if (!track || slides.length === 0) return;
  const trackElement = track;

  let index = 0;
  let pointerStartX: number | null = null;

  function render(): void {
    trackElement.style.transform = `translateX(-${index * 100}%)`;

    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === index;
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      if (active) {
        slide.removeAttribute('inert');
      } else {
        slide.setAttribute('inert', '');
      }
    });

    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === index;
      dot.setAttribute('aria-current', active ? 'true' : 'false');
      dot.dataset.active = active ? 'true' : 'false';
      const marker = dot.firstElementChild;
      if (marker) {
        marker.classList.toggle('bg-brand', active);
        marker.classList.toggle('bg-blue-200', !active);
        marker.classList.toggle('scale-125', active);
      }
    });

    if (status) {
      status.textContent = `Avaliação ${index + 1} de ${slides.length}`;
    }
  }

  function goTo(target: number): void {
    index = (target + slides.length) % slides.length;
    render();
  }

  prev?.addEventListener('click', () => goTo(index - 1));
  next?.addEventListener('click', () => goTo(index + 1));

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener('click', () => goTo(dotIndex));
  });

  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(index - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(index + 1);
    }
  });

  trackElement.addEventListener('pointerdown', (event) => {
    pointerStartX = event.clientX;
  });

  trackElement.addEventListener('pointerup', (event) => {
    if (pointerStartX === null) return;
    const delta = event.clientX - pointerStartX;
    pointerStartX = null;
    if (Math.abs(delta) < 40) return;
    goTo(delta > 0 ? index - 1 : index + 1);
  });

  trackElement.addEventListener('pointercancel', () => {
    pointerStartX = null;
  });

  render();
}

roots.forEach((root) => setup(root));

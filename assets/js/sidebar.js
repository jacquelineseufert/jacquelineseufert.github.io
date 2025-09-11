(() => {
  const html = document.documentElement;
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('backdrop');
  const edgeZone = document.getElementById('edge-swipe-zone');
  const MOBILE = matchMedia('(max-width: 768px)');
  const OPEN_CLASS = 'drawer-open';

  let startX = 0, currentX = 0, dragging = false, opening = false;

  const sidebarWidth = () => sidebar.getBoundingClientRect().width;

  const open = () => {
    html.classList.add(OPEN_CLASS);
    backdrop.hidden = false;
    sidebar.style.transform = '';
  };

  const close = () => {
    html.classList.remove(OPEN_CLASS);
    sidebar.style.transform = '';
    setTimeout(() => {
      if (!html.classList.contains(OPEN_CLASS)) backdrop.hidden = true;
    }, 250);
  };

  const setTranslate = (x) => {
    sidebar.style.transition = 'none';
    sidebar.style.transform = `translate3d(${x}px,0,0)`;
  };

  const onStart = (e) => {
    if (!MOBILE.matches) return;
    startX = e.touches[0].clientX;
    currentX = startX;

    const inEdge = startX < 30;
    const rect = sidebar.getBoundingClientRect();
    const inSidebar = startX >= rect.left && startX <= rect.right;

    if (!html.classList.contains(OPEN_CLASS) && inEdge) {
      opening = true; dragging = true;
      backdrop.hidden = false;
    } else if (html.classList.contains(OPEN_CLASS) && inSidebar) {
      opening = false; dragging = true;
    }
  };

  const onMove = (e) => {
    if (!dragging) return;
    currentX = e.touches[0].clientX;
    const delta = currentX - startX;
    const w = sidebarWidth();

    if (opening) {
      const x = Math.min(0, -w + Math.max(0, delta));
      setTranslate(x);
      backdrop.style.opacity = Math.min(1, delta / w) * 0.35;
    } else {
      const x = Math.max(-w, -Math.max(0, startX - currentX));
      setTranslate(x);
      backdrop.style.opacity = Math.max(0, 1 - (startX - currentX) / w) * 0.35;
    }
  };

  const onEnd = () => {
    if (!dragging) return;
    dragging = false;

    const delta = currentX - startX;
    const w = sidebarWidth();

    if (opening) {
      delta > w * 0.3 ? open() : close();
    } else {
      delta < -w * 0.3 ? close() : open();
    }
  };

  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  document.addEventListener('touchstart', onStart, { passive: true });
  document.addEventListener('touchmove', onMove, { passive: true });
  document.addEventListener('touchend', onEnd);

  MOBILE.addEventListener('change', () => {
    if (!MOBILE.matches) {
      html.classList.remove(OPEN_CLASS);
      sidebar.style.transform = '';
      backdrop.hidden = true;
    } else {
      close();
    }
  });
})();

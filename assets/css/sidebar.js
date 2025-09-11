(() => {
  const html = document.documentElement;
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('backdrop');
  const edgeZone = document.getElementById('edge-swipe-zone');

  const OPEN_CLASS = 'drawer-open';
  const MOBILE_Q = matchMedia('(max-width: 768px)');

  let startX = 0;
  let currentX = 0;
  let dragging = false;
  let opening = false; // true if swipe to open, false if swipe to close
  let rafId = null;

  const width = () => sidebar.getBoundingClientRect().width;

  const openDrawer = () => {
    html.classList.add(OPEN_CLASS);
    backdrop.hidden = false;
    sidebar.style.transition = '';
    sidebar.style.transform = '';
  };

  const closeDrawer = () => {
    html.classList.remove(OPEN_CLASS);
    sidebar.style.transition = '';
    sidebar.style.transform = '';
    setTimeout(() => {
      if (!html.classList.contains(OPEN_CLASS)) backdrop.hidden = true;
    }, 250);
  };

  const setTranslate = (x) => {
    sidebar.style.transition = 'none';
    sidebar.style.transform = `translate3d(${x}px,0,0)`;
  };

  const onTouchStart = (e) => {
    if (!MOBILE_Q.matches) return;
    startX = e.touches[0].clientX;
    currentX = startX;

    const inEdge = startX < 30;
    const sidebarRect = sidebar.getBoundingClientRect();
    const inSidebar = startX >= sidebarRect.left && startX <= sidebarRect.right;

    if (!html.classList.contains(OPEN_CLASS) && inEdge) {
      // start opening
      opening = true;
      dragging = true;
      backdrop.hidden = false;
      requestAnimationFrame(step);
    } else if (html.classList.contains(OPEN_CLASS) && inSidebar) {
      // start closing
      opening = false;
      dragging = true;
      requestAnimationFrame(step);
    }
  };

  const onTouchMove = (e) => {
    if (!dragging) return;
    currentX = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!dragging) return;
    dragging = false;

    const delta = currentX - startX;
    const w = width();

    if (opening) {
      if (delta > w * 0.3) openDrawer();
      else closeDrawer();
    } else {
      if (delta < -w * 0.3) closeDrawer();
      else openDrawer();
    }

    cancelAnimationFrame(rafId);
  };

  const step = () => {
    if (!dragging) return;
    const w = width();

    if (opening) {
      const delta = Math.max(0, currentX - startX);
      const x = Math.min(0, -w + delta);
      setTranslate(x);
      backdrop.style.opacity = String(Math.min(1, delta / w) * 0.35);
    } else {
      const delta = Math.max(0, startX - currentX);
      const x = Math.max(-w, -delta);
      setTranslate(x);
      backdrop.style.opacity = String(Math.max(0, 1 - delta / w) * 0.35);
    }

    rafId = requestAnimationFrame(step);
  };

  // Backdrop + ESC
  backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && html.classList.contains(OPEN_CLASS)) {
      closeDrawer();
    }
  });

  // Touch events
  document.addEventListener('touchstart', onTouchStart, { passive: true });
  document.addEventListener('touchmove', onTouchMove, { passive: true });
  document.addEventListener('touchend', onTouchEnd);

  // Reset state when resizing
  MOBILE_Q.addEventListener('change', () => {
    if (!MOBILE_Q.matches) {
      // desktop
      html.classList.remove(OPEN_CLASS);
      sidebar.style.transform = '';
      backdrop.hidden = true;
    } else {
      // mobile, reset closed
      closeDrawer();
    }
  });
})();

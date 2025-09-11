(() => {
  const html = document.documentElement;
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('backdrop');
  const edgeZone = document.getElementById('edge-swipe-zone');
  const MOBILE_Q = matchMedia('(max-width: 768px)');
  const OPEN_CLASS = 'drawer-open';

  let startX = 0, currentX = 0, dragging = false, opening = false;

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
      opening = true; dragging = true;
      backdrop.hidden = false;
    } else if (html.classList.contains(OPEN_CLASS) && inSidebar) {
      opening = false; dragging = true;
    }
  };

  const onTouchMove = (e) => {
    if (!dragging) return;
    currentX = e.touches[0].clientX;
    const delta = currentX - startX;
    const w = width();

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

  const onTouchEnd = () => {
    if (!dragging) return;
    dragging = false;
    const delta = currentX - startX;
    const w = width();

    if (opening) {
      if (delta > w * 0.3) openDrawer(); else closeDrawer();
    } else {
      if (delta < -w * 0.3) closeDrawer(); else openDrawer();
    }
  };

  backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && html.classList.contains(OPEN_CLASS)) closeDrawer();
  });

  document.addEventListener('touchstart', onTouchStart, { passive: true });
  document.addEventListener('touchmove', onTouchMove, { passive: true });
  document.addEventListener('touchend', onTouchEnd);

  MOBILE_Q.addEventListener('change', () => {
    if (!MOBILE_Q.matches) {
      html.classList.remove(OPEN_CLASS);
      sidebar.style.transform = '';
      backdrop.hidden = true;
    } else {
      closeDrawer();
    }
  });
})();

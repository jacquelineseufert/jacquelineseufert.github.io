(() => {
  const html = document.documentElement;
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('backdrop');
  const MOBILE = matchMedia('(max-width: 768px)');
  const CLOSED_CLASS = 'drawer-closed';

  let startX = 0, currentX = 0, dragging = false, closing = false;

  const sidebarWidth = () => sidebar.getBoundingClientRect().width;

  const open = () => {
    html.classList.remove(CLOSED_CLASS);
    backdrop.hidden = false;
    sidebar.style.transition = 'transform .25s ease';
    sidebar.style.transform = 'translate3d(0,0,0)';
    backdrop.style.opacity = 0.35;
  };

  const close = () => {
    html.classList.add(CLOSED_CLASS);
    sidebar.style.transition = 'transform .25s ease';
    sidebar.style.transform = `translate3d(-${sidebarWidth()}px,0,0)`;
    backdrop.style.opacity = 0;
    setTimeout(() => {
      if (html.classList.contains(CLOSED_CLASS)) backdrop.hidden = true;
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

  const rect = sidebar.getBoundingClientRect();
  const inSidebar = startX >= rect.left && startX <= rect.right;

  // Allow up to 40% of screen width as swipe-in zone
  const screenW = window.innerWidth;
  const inEdge = startX < screenW * 0.4;

  if (!html.classList.contains(CLOSED_CLASS) && inSidebar) {
    closing = true; 
    dragging = true;
  } else if (html.classList.contains(CLOSED_CLASS) && inEdge) {
    closing = false; 
    dragging = true;
    backdrop.hidden = false;
  }
};


  const onMove = (e) => {
    if (!dragging) return;
    currentX = e.touches[0].clientX;
    const delta = currentX - startX;
    const w = sidebarWidth();

    if (closing) {
      const x = Math.max(-w, Math.min(0, delta));
      setTranslate(x);
      backdrop.style.opacity = Math.max(0, 1 + delta / w) * 0.35;
    } else {
      const x = Math.min(0, -w + Math.max(0, delta));
      setTranslate(x);
      backdrop.style.opacity = Math.min(1, delta / w) * 0.35;
    }
  };

  const onEnd = () => {
    if (!dragging) return;
    dragging = false;

    const delta = currentX - startX;
    const w = sidebarWidth();

    sidebar.style.transition = 'transform .25s ease';

    if (closing) {
      delta < -w * 0.3 ? close() : open();
    } else {
      delta > w * 0.3 ? open() : close();
    }
  };

  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  document.addEventListener('touchstart', onStart, { passive: true });
  document.addEventListener('touchmove', onMove, { passive: true });
  document.addEventListener('touchend', onEnd);

  MOBILE.addEventListener('change', () => {
    if (!MOBILE.matches) {
      // desktop: sidebar always visible
      html.classList.remove(CLOSED_CLASS);
      sidebar.style.transform = '';
      backdrop.hidden = true;
    } else {
      // mobile: sidebar starts closed
      close();
    }
  });

  // Initial setup
  if (MOBILE.matches) {
    close();   // start closed on mobile
  } else {
    html.classList.remove(CLOSED_CLASS); // open on desktop
    backdrop.hidden = true;
  }
})();

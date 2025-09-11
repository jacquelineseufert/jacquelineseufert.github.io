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

(() => {
        const html = document.documentElement;
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('backdrop');
        const MOBILE = matchMedia('(max-width: 768px)');
        const CLOSED_CLASS = 'drawer-closed';
        let startX = 0,
            currentX = 0,
            dragging = false,
            closing = false;
        const sidebarWidth = () => sidebar.getBoundingClientRect().width;
        const open = () => {
            html.classList.remove(CLOSED_CLASS);
            backdrop.hidden = false;
            sidebar.style.transform = 'translate3d(0,0,0)';
        };
        const close = () => {
            html.classList.add(CLOSED_CLASS);
            sidebar.style.transform = '';
            setTimeout(() => {
                if (html.classList.contains(CLOSED_CLASS)) backdrop.hidden = true;
            }, 250);
        };
        const setTranslate = (x) => {
            sidebar.style.transition = 'none';
            sidebar.style.transform = translate3d($ {
                    x
                }
                px, 0, 0);
        };
        const onStart = (e) => {
            if (!MOBILE.matches) return;
            startX = e.touches[0].clientX;
            currentX = startX;
            const rect = sidebar.getBoundingClientRect();
            const inSidebar = startX >= rect.left && startX <= rect.right;
            const inEdge = startX < 30;
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
            if (closing) {
                delta < -w * 0.3 ? close() : open();
            } else {
                delta > w * 0.3 ? open() : close();
            }
        };
        backdrop.addEventListener('click', close);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });
        document.addEventListener('touchstart', onStart, {
            passive: true
        });
        document.addEventListener('touchmove', onMove, {
            passive: true
        });
        document.addEventListener('touchend', onEnd);
        MOBILE.addEventListener('change', () => {
            if (!MOBILE.matches) {
                html.classList.remove(CLOSED_CLASS);
                sidebar.style.transform = '';
                backdrop.hidden = true;
            } else {
                open();
            }
        }); // Start visible on mobile if (MOBILE.matches) open(); })();

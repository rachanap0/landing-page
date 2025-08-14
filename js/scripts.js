/*!
* Start Bootstrap - Creative v7.0.7 (https://startbootstrap.com/theme/creative)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-creative/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Activate SimpleLightbox plugin for portfolio items
    new SimpleLightbox({
        elements: '#portfolio a.portfolio-box'
    });

});

// Simple count-up for KPI numbers
(function () {
  const els = document.querySelectorAll('.stat-number');
  const ease = t => 1 - Math.pow(1 - t, 3); // easeOutCubic

  function animate(el){
    const target = parseFloat(el.getAttribute('data-target') || '0');
    const start = performance.now();
    const dur = 900 + Math.random()*400;

    function tick(now){
      const p = Math.min(1, (now - start)/dur);
      el.textContent = Math.round(ease(p) * target).toLocaleString();
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // trigger when the strip scrolls into view
// trigger when the about KPIs scroll into view
    const section = document.getElementById('about-stats');
    if (!section) return;
    const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) { els.forEach(animate); io.disconnect(); }
    });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    io.observe(section);

})();

// Reveal-on-scroll for snap sections
(function () {
  const panels = document.querySelectorAll('.snap');
  if (!panels.length) return;

  // mark panels as revealable (CSS looks for [data-reveal])
  panels.forEach(el => el.setAttribute('data-reveal', ''));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // unobserve once revealed to avoid re-triggering
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

  panels.forEach((el) => io.observe(el));
})();


// at end of js/scripts.js
(function () {
  function setNavHeight() {
    const nav = document.getElementById('mainNav');
    const h = (nav && nav.offsetHeight) ? nav.offsetHeight : 64;
    const root = document.documentElement.style;
    root.setProperty('--nav-h', h + 'px');
    root.setProperty('--stats-pull-up', h + 'px');
  }
  window.addEventListener('load', setNavHeight);
  window.addEventListener('resize', setNavHeight);
  document.addEventListener('scroll', setNavHeight, { passive: true });
})();

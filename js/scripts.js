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
  const navbarShrink = function () {
    const navbarCollapsible = document.body.querySelector('#mainNav');
    if (!navbarCollapsible) return;
    if (window.scrollY === 0) {
      navbarCollapsible.classList.remove('navbar-shrink');
    } else {
      navbarCollapsible.classList.add('navbar-shrink');
    }
  };

  // Shrink the navbar
  navbarShrink();

  // Shrink the navbar when page is scrolled
  document.addEventListener('scroll', navbarShrink, { passive: true });

  // Activate Bootstrap scrollspy on the main nav element
  const mainNav = document.body.querySelector('#mainNav');
  if (mainNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: '#mainNav',
      rootMargin: '0px 0px -40%',
    });
  }

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

  // Activate SimpleLightbox plugin for portfolio items (general portfolio section)
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

  // Trigger when the KPIs container scrolls into view
  const section = document.getElementById('about-stats') || document.getElementById('stats');
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


// Update CSS vars for navbar height (used by spacing/snap)
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


// Leadership: reactive gallery, single-image full-bleed,
// and fit the whole split inside the viewport
(function(){
  const section = document.getElementById('leadership');
  const split   = section?.querySelector('.lead-split');
  const list    = document.getElementById('lead-timeline');   // left column (timeline)
  const gallery = document.getElementById('lead-gallery');     // right column grid container
  const galleryWrap = section?.querySelector('.lead-gallery-wrap');
  if (!section || !split || !list || !gallery || !galleryWrap) return;

  const links = Array.from(list.querySelectorAll('.lead-step-link'));
  let current = null;
  let lightbox = null;
  let rafId = 0;

  // --- size split to available viewport height (title stays visible) ---
  function sizeSplit(){
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const sRect = split.getBoundingClientRect();
      const sStyle = getComputedStyle(section);
      const padBottom = parseFloat(sStyle.paddingBottom) || 0;

      // space from top of split to bottom of viewport minus section bottom padding
      let avail = window.innerHeight - sRect.top - padBottom;

      // clamp to sensible range so it never collapses or overflows
      avail = Math.max(360, Math.min(avail, window.innerHeight));

      split.style.height = avail + 'px';
      // left column scrolls inside if content taller
      list.style.height = '100%';
      list.style.overflow = 'auto';
      // right column matches the split
      galleryWrap.style.height = '100%';
    });
  }

  window.addEventListener('load',  sizeSplit);
  window.addEventListener('resize', sizeSplit);
  document.addEventListener('scroll', sizeSplit, { passive:true });

  function parseGalleryData(link){
    try{
      const raw = link.getAttribute('data-gallery') || '[]';
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    }catch{ return []; }
  }

  // render images; if exactly one → full-bleed; otherwise 2×2 grid
  function renderGallery(link){
    if (!link || link === current) return;
    current = link;

    // active state
    links.forEach(a => a.classList.toggle('is-active', a === link));

    const raw = parseGalleryData(link);

    // SINGLE IMAGE → full-bleed
    if (raw.length === 1){
      const item  = raw[0] || {};
      const href  = item.href  || item.src || '#';
      const thumb = item.thumb || item.href || item.src || href;

      gallery.classList.add('is-single');   // CSS switches to full-bleed
      gallery.innerHTML = `<a class="portfolio-box" href="${href}">
        <img src="${thumb}" alt="">
      </a>`;

      if (typeof SimpleLightbox === 'function'){
        if (!lightbox) lightbox = new SimpleLightbox('#lead-gallery a.portfolio-box');
        else lightbox.refresh();
      }

      sizeSplit(); // fit immediately
      const img = gallery.querySelector('img');
      if (img && !img.complete){
        img.addEventListener('load',  sizeSplit, { once:true });
        img.addEventListener('error', sizeSplit, { once:true });
      }
      return;
    }

    // 2+ IMAGES → 2×2 grid (repeat to fill 4)
    gallery.classList.remove('is-single');

    let items = raw.slice(0, 4);
    if (items.length === 2) items = [items[0], items[1], items[0], items[1]];
    if (items.length === 3) items = [items[0], items[1], items[2], items[0]];
    while (items.length < 4 && raw.length) items.push(raw[items.length % raw.length]);

    gallery.innerHTML = items.map(item => {
      const href  = item.href  || item.src || '#';
      const thumb = item.thumb || item.href || item.src || href;
      return `<a class="portfolio-box" href="${href}"><img src="${thumb}" alt=""></a>`;
    }).join('');

    if (typeof SimpleLightbox === 'function'){
      if (!lightbox) lightbox = new SimpleLightbox('#lead-gallery a.portfolio-box');
      else lightbox.refresh();
    }

    sizeSplit(); // fit immediately

    const imgs = Array.from(gallery.querySelectorAll('img'));
    if (!imgs.length) { sizeSplit(); return; }
    let pending = imgs.length;
    imgs.forEach(img => {
      if (img.complete) {
        if (--pending === 0) sizeSplit();
      } else {
        img.addEventListener('load',  () => { if (--pending === 0) sizeSplit(); }, { once:true });
        img.addEventListener('error', () => { if (--pending === 0) sizeSplit(); }, { once:true });
      }
    });
  }

  function scheduleRender(link){
    if (link === current) return;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => renderGallery(link));
  }

  // listeners (mouseenter avoids flicker)
  links.forEach(link => {
    link.addEventListener('mouseenter', () => scheduleRender(link));
    link.addEventListener('focus',      () => scheduleRender(link));
    link.addEventListener('click', (e) => { e.preventDefault(); scheduleRender(link); });
  });

  // initial render + initial fit
  if (links[0]) renderGallery(links[0]);
  sizeSplit();
})();


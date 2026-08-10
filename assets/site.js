/* ===========================================================
   URBAN HIPPIE — shared site behaviour, all four pages
   No external libraries. Everything below is a small vanilla
   stand-in for what a GSAP + Lenis build would do, chosen so
   these files run anywhere with zero CDN dependency risk.
   =========================================================== */
(function(){
  'use strict';

  var FINE   = window.matchMedia('(pointer:fine)').matches;
  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -----------------------------------------------------------
     0. WhatsApp — one number, per-button message.
        Edit WHATSAPP_NUMBER once; every .js-wa button updates.
        Give a button data-wa-msg="..." for a specific message,
        otherwise it falls back to the generic line below.
     ----------------------------------------------------------- */
  var WHATSAPP_NUMBER = '91XXXXXXXXXX'; // <-- replace with the real number
  var DEFAULT_MSG = "Hi, I'd like to order coffee.";
  document.querySelectorAll('.js-wa').forEach(function(a){
    var msg = a.getAttribute('data-wa-msg') || DEFAULT_MSG;
    a.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
    a.target = '_blank'; a.rel = 'noopener';
  });

  /* -----------------------------------------------------------
     0b. Measure the real fixed-header height so main's top
         padding is exact instead of guessed — the strip wraps
         to two lines on some narrow widths, so a fixed px value
         would drift.
     ----------------------------------------------------------- */
  (function(){
    var header = document.getElementById('siteHeader');
    if(!header) return;
    function setH(){ document.documentElement.style.setProperty('--nav-h', header.offsetHeight + 'px'); }
    setH();
    window.addEventListener('resize', setH);
    new ResizeObserver(setH).observe(header);
  })();

  /* -----------------------------------------------------------
     1. Live IST clock
     ----------------------------------------------------------- */
  document.querySelectorAll('.js-clock').forEach(function(el){
    function tick(){ el.textContent = new Date().toLocaleTimeString('en-GB',{timeZone:'Asia/Kolkata',hour12:false}); }
    tick(); setInterval(tick, 1000);
  });

  /* -----------------------------------------------------------
     2. Current-page nav highlight
     ----------------------------------------------------------- */
  var here = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.links a[href]').forEach(function(a){
    var href = a.getAttribute('href');
    if(href === here || (here === '' && href === 'index.html')) a.classList.add('current');
  });

  /* -----------------------------------------------------------
     3a. Hero / page-header reveals — fire on load, unconditionally.
         Above-the-fold content should never depend on a scroll
         threshold to become visible.
     ----------------------------------------------------------- */
  requestAnimationFrame(function(){
    document.querySelectorAll('.rv-hero').forEach(function(n){ n.classList.add('in'); });
  });

  /* -----------------------------------------------------------
     3b. Scroll reveals — IntersectionObserver, for everything
         below the fold.
     ----------------------------------------------------------- */
  (function(){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:.16, rootMargin:'0px 0px -8% 0px'});
    document.querySelectorAll('.rv').forEach(function(n){ io.observe(n); });
  })();

  /* -----------------------------------------------------------
     4. Magnetic buttons — desktop / trackpad only. Touch devices
        get the plain button; nothing below runs there.
     ----------------------------------------------------------- */
  if(FINE && !REDUCE){
    /* magnetic pull on buttons */
    document.querySelectorAll('.magnetic').forEach(function(el){
      var tx=0, ty=0, cx=0, cy=0;
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        tx = (e.clientX - (r.left+r.width/2)) * .32;
        ty = (e.clientY - (r.top +r.height/2)) * .32;
      });
      el.addEventListener('mouseleave', function(){ tx=0; ty=0; });
      (function loop(){
        requestAnimationFrame(loop);
        cx += (tx-cx)*.18; cy += (ty-cy)*.18;
        el.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)';
      })();
    });
  }

  /* -----------------------------------------------------------
     5. Smooth scroll — desktop / trackpad only, and only when
        motion is not reduced. Touch devices get plain native
        scrolling; iOS momentum + a faked scroll fight each other
        badly, so this is deliberately skipped there.
     ----------------------------------------------------------- */
  if(FINE && !REDUCE){
    var area    = document.getElementById('scrollArea');
    var content = document.getElementById('scrollContent');
    var spacer  = document.getElementById('spacer');
    if(area && content && spacer){
      document.documentElement.classList.add('has-smooth');
      var target = window.scrollY, current = target;

      function resize(){ spacer.style.height = content.offsetHeight + 'px'; }
      resize();
      window.addEventListener('resize', resize);
      new ResizeObserver(resize).observe(content);
      window.addEventListener('load', resize);

      window.addEventListener('scroll', function(){ target = window.scrollY; }, {passive:true});

      (function loop(){
        requestAnimationFrame(loop);
        current += (target - current) * .1;
        if(Math.abs(target-current) < .05) current = target;
        content.style.transform = 'translate3d(0,' + (-current).toFixed(1) + 'px,0)';
      })();
    }
  }

  /* -----------------------------------------------------------
     6. Page-fade transition between real pages.
        These are static files, not a single-page app — this is
        a fade-out / fade-in around a normal navigation, not a
        Barba-style content swap. It works the same whether the
        site is opened locally or hosted.
     ----------------------------------------------------------- */
  requestAnimationFrame(function(){ document.body.classList.add('is-ready'); });

  document.querySelectorAll('a[href]').forEach(function(a){
    var href = a.getAttribute('href') || '';
    var isLocalPage = /^[a-zA-Z0-9_-]+\.html(#.*)?$/.test(href);
    if(!isLocalPage) return;
    a.addEventListener('click', function(e){
      if(e.metaKey || e.ctrlKey || e.shiftKey) return; // let new-tab clicks through untouched
      e.preventDefault();
      document.body.classList.remove('is-ready');
      document.body.classList.add('is-leaving');
      setTimeout(function(){ location.href = href; }, 380);
    });
  });

  window.addEventListener('pageshow', function(e){
    if(e.persisted){ document.body.classList.remove('is-leaving'); document.body.classList.add('is-ready'); }
  });
})();

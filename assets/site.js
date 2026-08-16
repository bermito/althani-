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
  var WHATSAPP_NUMBER = '919895474842';
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
     2. Current-page nav highlight (top nav + mobile menu)
     ----------------------------------------------------------- */
  var here = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.links a[href], .mobile-menu a[href]').forEach(function(a){
    var href = a.getAttribute('href');
    if(href === here || (here === '' && href === 'index.html')) a.classList.add('current');
  });

  /* -----------------------------------------------------------
     2b. Mobile menu — the only way to reach About/Wholesale/
         Contact once the nav links hide at 860px.
     ----------------------------------------------------------- */
  (function(){
    var btn = document.getElementById('menuToggle');
    var menu = document.getElementById('mobileMenu');
    if(!btn || !menu) return;

    function close(){
      document.documentElement.classList.remove('menu-open');
      btn.setAttribute('aria-expanded', 'false');
    }
    function open(){
      document.documentElement.classList.add('menu-open');
      btn.setAttribute('aria-expanded', 'true');
    }
    btn.addEventListener('click', function(){
      document.documentElement.classList.contains('menu-open') ? close() : open();
    });
    menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', close); });
    document.addEventListener('click', function(e){
      if(document.documentElement.classList.contains('menu-open') &&
         !menu.contains(e.target) && !btn.contains(e.target)) close();
    });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });
    window.addEventListener('resize', function(){ if(window.innerWidth > 860) close(); });
  })();

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
     7. Farm-to-cup → Recognition ambient glow. One large soft
        light drifts down through this span as the page scrolls,
        fading in as Farm to Cup arrives and out before
        Recognition's first award. A slow blob wobble runs
        always (see site.css); a small nudge toward the cursor
        only on desktop / trackpad.
     ----------------------------------------------------------- */
  (function(){
    if(REDUCE) return;
    var track = document.getElementById('glowTrack');
    var glow  = document.getElementById('glow');
    if(!track || !glow) return;

    var tx=0, ty=0, nx=0, ny=0;
    if(FINE){
      track.addEventListener('mousemove', function(e){
        var r = track.getBoundingClientRect();
        tx = (e.clientX - (r.left + r.width/2)) * .12;
        ty = (e.clientY - r.top) * .05;
      });
      track.addEventListener('mouseleave', function(){ tx = 0; ty = 0; });
    }

    (function frame(){
      requestAnimationFrame(frame);
      var r = track.getBoundingClientRect();
      var pivot = window.innerHeight * .35;
      var progress = Math.max(0, Math.min(1, (pivot - r.top) / r.height));

      var op;
      if(progress < .08) op = progress / .08;
      else if(progress > .85) op = (1 - progress) / .15;
      else op = 1;
      op = Math.max(0, Math.min(1, op));

      var glowH = glow.offsetHeight || 400;
      var topPx = progress * Math.max(0, r.height - glowH);

      nx += (tx - nx) * .08;
      ny += (ty - ny) * .08;

      glow.style.opacity = (op * .95).toFixed(2);
      glow.style.transform = 'translate(calc(-50% + ' + nx.toFixed(1) + 'px),' + (topPx + ny).toFixed(1) + 'px)';
    })();
  })();

  /* -----------------------------------------------------------
     7b. Shutter lift — the site ends at Privacy · Terms. A short
         extra stretch of scroll past that end slides the whole
         page up off the fixed reveal panel behind it, exposing
         the word mark. Moves #scrollArea rather than the content
         inside it, so it works alongside the smooth-scroll engine.
     ----------------------------------------------------------- */
  (function(){
    if(REDUCE) return;
    var area    = document.getElementById('scrollArea');
    var panel   = document.querySelector('.reveal-panel');
    var spacer  = document.getElementById('spacer');
    var content = document.getElementById('scrollContent');
    if(!area || !panel || !content) return;

    function panelH(){ return panel.offsetHeight; }

    /* add the shutter distance to the page height, so there's somewhere
       to scroll to once the page proper has ended */
    function sizeSpacer(){
      var extra = panelH();
      if(spacer && document.documentElement.classList.contains('has-smooth')){
        spacer.style.height = (content.offsetHeight + extra) + 'px';
      } else {
        document.body.style.paddingBottom = extra + 'px';
      }
    }
    sizeSpacer();
    window.addEventListener('resize', sizeSpacer);
    new ResizeObserver(sizeSpacer).observe(content);

    function update(){
      var doc = document.documentElement;
      var maxScroll = doc.scrollHeight - window.innerHeight;
      var extra = panelH();
      var into = Math.max(0, window.scrollY - (maxScroll - extra));
      var lift = Math.min(into, extra);
      area.style.transform = lift > 0 ? 'translate3d(0,' + (-lift).toFixed(1) + 'px,0)' : '';
    }
    window.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', update);
    update();
  })();

  /* -----------------------------------------------------------
     8. Page-fade transition between real pages.
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

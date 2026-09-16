/* ============================================================
   高旭辰 · 个人主页  —  main.js  (v2)
   1) 深浅色主题切换（记忆用户选择）
   2) 滚动进入的渐显动效（含错峰）
   3) 导航：吸顶描边 + 滑块指示器 + 阅读进度
   4) 联系方式一键复制
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. 主题切换 ---------- */
  var toggle = document.getElementById('themeToggle');

  function syncThemeColor() {
    var isDark = root.getAttribute('data-theme') === 'dark';
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    if (metas.length) {
      metas[metas.length - 1].setAttribute('content', isDark ? '#0A0B0E' : '#FAFAF9');
    }
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncThemeColor();
      positionPill();
    });
  }
  syncThemeColor();

  /* ---------- 2. 滚动渐显 ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  revealEls.forEach(function (el) {
    var group = el.parentElement;
    if (!group) return;
    var siblings = Array.prototype.filter.call(group.children, function (c) {
      return c.classList && c.classList.contains('reveal');
    });
    var i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty('--d', Math.min(i, 7) * 60 + 'ms');
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 3. 导航 ---------- */
  var nav = document.querySelector('.nav');
  var navLinks = document.querySelector('.nav-links');
  var pill = document.querySelector('.nav-pill');
  var progress = document.getElementById('scrollProgress');
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var sections = links
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);

  var activeLink = null;

  function positionPill() {
    if (!pill || !navLinks || !activeLink) {
      if (pill) pill.style.opacity = '0';
      return;
    }
    var host = navLinks.getBoundingClientRect();
    var target = activeLink.getBoundingClientRect();
    pill.style.width = target.width + 'px';
    pill.style.transform =
      'translateY(-50%) translateX(' + (target.left - host.left + navLinks.scrollLeft) + 'px)';
    pill.style.opacity = '1';
  }

  var ticking = false;

  function update() {
    var y = window.scrollY || window.pageYOffset;

    if (nav) nav.classList.toggle('is-stuck', y > 6);

    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    }

    var offset = (nav ? nav.offsetHeight : 62) + 96;
    var current = null;
    sections.forEach(function (sec) {
      if (sec.getBoundingClientRect().top - offset <= 0) current = sec.id;
    });

    var next = null;
    links.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + current;
      a.classList.toggle('is-active', on);
      if (on) next = a;
    });

    if (next !== activeLink) {
      activeLink = next;
      positionPill();
    }

    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () {
    positionPill();
    onScroll();
  }, { passive: true });
  if (navLinks) navLinks.addEventListener('scroll', positionPill, { passive: true });

  update();
  window.addEventListener('load', positionPill);

  /* ---------- 4. 一键复制 ---------- */
  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    return ok;
  }

  document.querySelectorAll('.copy-btn[data-copy]').forEach(function (btn) {
    var original = btn.textContent;
    var timer = null;

    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');

      function done() {
        btn.classList.add('is-done');
        btn.textContent = '已复制';
        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
          btn.classList.remove('is-done');
          btn.textContent = original;
        }, 1600);
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () {
          if (legacyCopy(text)) done();
        });
      } else if (legacyCopy(text)) {
        done();
      }
    });
  });
})();

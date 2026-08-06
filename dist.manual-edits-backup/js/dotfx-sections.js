(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (reduceMotion || !canHover) return;

  var ACCENT = [255, 91, 4];
  var DARK_BG_RGB = [255, 255, 255];
  var LIGHT_BG_RGB = [35, 48, 56];

  function initDotfx(canvas, host, cfg) {
    var ctx = canvas.getContext("2d");
    var spacing = cfg.spacing, baseR = cfg.size;
    var baseOpacity = cfg.opacity, hoverOpacity = cfg.opacityHover;
    var radius = cfg.radius, scaleMax = cfg.scale, pull = cfg.pull;
    var rgb = cfg.rgb, accent = cfg.accent;
    var dots = [], w = 0, h = 0, active = false, tx = 0, ty = 0, mx = 0, my = 0, raf = 0;

    function settled(d) {
      return Math.abs(d.x - d.hx) <= 0.02 && Math.abs(d.y - d.hy) <= 0.02 &&
        Math.abs(d.a - baseOpacity) <= 0.004 && Math.abs(d.r - baseR) <= 0.01 && d.t <= 0.004;
    }

    function resize() {
      var rect = host.getBoundingClientRect();
      var nw = Math.round(rect.width), nh = Math.round(rect.height);
      if (nw === 0 || nh === 0 || (nw === w && nh === h)) return;
      w = nw; h = nh;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (var y = spacing / 2; y < h; y += spacing) {
        for (var x = spacing / 2; x < w; x += spacing) {
          dots.push({ hx: x, hy: y, x: x, y: y, vx: 0, vy: 0, a: baseOpacity, r: baseR, t: 0 });
        }
      }
      draw();
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      var restPath = new Path2D();
      var hasRest = false;
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        if (settled(d)) {
          restPath.moveTo(d.hx + baseR, d.hy);
          restPath.arc(d.hx, d.hy, baseR, 0, Math.PI * 2);
          hasRest = true;
          continue;
        }
        var t = d.t;
        var r = Math.round(rgb[0] + (accent[0] - rgb[0]) * t);
        var g = Math.round(rgb[1] + (accent[1] - rgb[1]) * t);
        var b = Math.round(rgb[2] + (accent[2] - rgb[2]) * t);
        ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + d.a + ")";
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (hasRest) {
        ctx.fillStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + baseOpacity + ")";
        ctx.fill(restPath);
      }
    }

    function tick() {
      tx += (mx - tx) * 0.14;
      ty += (my - ty) * 0.14;
      var moving = active && (Math.abs(mx - tx) > 0.4 || Math.abs(my - ty) > 0.4);
      var anyUnsettled = false;
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        var ox = d.hx, oy = d.hy, oa = baseOpacity, orr = baseR, ot = 0;
        if (active) {
          var dx = tx - d.hx, dy = ty - d.hy, dist = Math.hypot(dx, dy);
          if (dist < radius) {
            var f = 1 - dist / radius;
            var e = f * f * (3 - 2 * f);
            if (dist > 0.001) {
              var pullAmt = Math.min(pull * e, dist * 0.7);
              ox += (dx / dist) * pullAmt;
              oy += (dy / dist) * pullAmt;
            }
            oa = baseOpacity + (hoverOpacity - baseOpacity) * e;
            orr = baseR * (1 + (scaleMax - 1) * e);
            ot = e * e;
          }
        }
        d.vx = (d.vx + (ox - d.x) * 0.13) * 0.8;
        d.vy = (d.vy + (oy - d.y) * 0.13) * 0.8;
        d.x += d.vx;
        d.y += d.vy;
        d.a += (oa - d.a) * 0.16;
        d.r += (orr - d.r) * 0.16;
        d.t += (ot - d.t) * 0.16;
        if (!settled(d)) anyUnsettled = true;
      }
      draw();
      if (active || moving || anyUnsettled) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
        for (var i = 0; i < dots.length; i++) {
          var d = dots[i];
          d.x = d.hx; d.y = d.hy; d.vx = 0; d.vy = 0;
          d.a = baseOpacity; d.r = baseR; d.t = 0;
        }
        draw();
      }
    }

    function wake() {
      if (!raf) raf = requestAnimationFrame(tick);
    }

    host.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      var rect = host.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
      if (!active) { tx = mx; ty = my; active = true; }
      wake();
    });
    host.addEventListener("pointerleave", function () {
      active = false;
      wake();
    });
    new ResizeObserver(resize).observe(host);
    resize();
    window.addEventListener("load", resize);
  }

  var hideStyleInjected = false;
  function ensureHideStyle() {
    if (hideStyleInjected) return;
    hideStyleInjected = true;
    var style = document.createElement("style");
    // Once the canvas takes over, hide the static ::before dot layer so we
    // never render two independently-rasterized dot grids on top of each
    // other (causes visible misalignment/ghosting under fractional DPI scaling).
    style.textContent = ".section--dotted[data-dotfx-active]::before{opacity:0}";
    document.head.appendChild(style);
  }

  function addCanvas(host, cfg, opts) {
    if (host.querySelector(":scope > canvas.dotfx")) return;
    if (getComputedStyle(host).position === "static") {
      host.style.position = "relative";
    }
    var canvas = document.createElement("canvas");
    canvas.className = "dotfx";
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "0";
    host.insertBefore(canvas, host.firstChild);
    initDotfx(canvas, host, cfg);
    if (opts && opts.hideBackgroundImage) {
      host.style.backgroundImage = "none";
    }
    if (opts && opts.hideBeforePseudo) {
      ensureHideStyle();
      host.setAttribute("data-dotfx-active", "");
    }
  }

  function setup() {
    document.querySelectorAll(".section--dotted").forEach(function (section) {
      var dark = section.classList.contains("section--ink") || section.classList.contains("section--teal");
      addCanvas(section, {
        spacing: 26,
        size: 1,
        rgb: dark ? DARK_BG_RGB : LIGHT_BG_RGB,
        accent: ACCENT,
        opacity: dark ? 0.06 : 0.05,
        opacityHover: 1,
        radius: 200,
        scale: 2.8,
        pull: 7
      }, { hideBeforePseudo: true });
    });

    // Hero-style static dot grids (e.g. platform hero, 404 page). The homepage
    // hero already ships its own hand-placed dotfx canvas, so skip it here.
    document.querySelectorAll(".dotted-grid").forEach(function (grid) {
      if (grid.classList.contains("hero__grid")) return;
      addCanvas(grid, {
        spacing: 30,
        size: 1,
        rgb: DARK_BG_RGB,
        accent: ACCENT,
        opacity: 0.25,
        opacityHover: 1,
        radius: 200,
        scale: 2.8,
        pull: 7
      }, { hideBackgroundImage: true });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }
})();

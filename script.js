(function () {
  function $(s) { return document.querySelector(s); }
  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  /* Stars across the sky background. Seeded so the sky looks the same every visit. */
  (function () {
    var box = $('.sky-bg');
    if (!box) return;
    var seed = 11;
    function rand() {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    var colors = ['#F3ECDA', '#F3ECDA', '#E6CD86', '#CFE0FF'];
    for (var i = 0; i < 120; i++) {
      var d = document.createElement('i');
      var bright = rand() < 0.08;
      var s = bright ? 2.5 + rand() * 1.5 : 1 + rand() * 1.6;
      d.className = 'star-dot' + (bright ? ' bright' : '');
      d.style.cssText = 'left:' + (rand() * 100).toFixed(2) + '%;top:' + (rand() * 100).toFixed(2) + '%;width:' + s.toFixed(1) + 'px;height:' + s.toFixed(1) + 'px;--star:' + colors[Math.floor(rand() * colors.length)] + ';--d:' + (2.5 + rand() * 4.5).toFixed(1) + 's;--dl:-' + (rand() * 7).toFixed(1) + 's';
      box.insertBefore(d, box.firstChild);
    }
  })();

  /* Greeting by the viewer's local time */
  (function () {
    var h = new Date().getHours(), t;
    if (h >= 5 && h < 11) t = 'Good morning, Ica. I hope today is kind to you.';
    else if (h >= 11 && h < 15) t = 'Good afternoon, Ica. Don’t forget to eat lunch.';
    else if (h >= 15 && h < 18) t = 'Good afternoon, Ica. Have some water and stretch a little.';
    else if (h >= 18 && h < 22) t = 'Good evening, Ica. Go easy on yourself tonight.';
    else t = 'It’s late, Ica. Sleep when you can. The books will still be there.';
    $('#greeting').textContent = t;
  })();

  /* Gentle reveal as things come into view. Everything is visible until its animation starts. */
  if (!reduce && 'IntersectionObserver' in window && Element.prototype.animate) {
    var io = new IntersectionObserver(function (entries) {
      var k = 0;
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        en.target.animate(
          [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }],
          { duration: 900, delay: Math.min(k, 8) * 140, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' }
        );
        k++;
      });
    }, { rootMargin: '0px 0px 8% 0px', threshold: 0.01 });
    document.querySelectorAll('.letter-body > p, .sec-head, .note, .ticket, footer').forEach(function (el) { io.observe(el); });
  }
})();

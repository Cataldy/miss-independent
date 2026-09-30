(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (id) => document.getElementById(id);

  /* corações flutuantes */
  const burst = (x, y, n = 1) => {
    if (still) return;
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = 'float';
      s.textContent = ['♡', '♥', '✦'][Math.floor(Math.random() * 3)];
      s.style.left = x + (Math.random() * 40 - 20) + 'px';
      s.style.top = y + 'px';
      s.style.setProperty('--dx', Math.random() * 120 - 60 + 'px');
      s.style.setProperty('--r', Math.random() * 60 - 30 + 'deg');
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1700);
    }
  };
  addEventListener('pointerdown', (e) => burst(e.clientX, e.clientY));

  /* carta */
  const letter = $('letter'), env = $('envelope'), paper = $('paper');
  env.addEventListener('click', () => {
    letter.classList.add('open');
    env.setAttribute('aria-expanded', 'true');
    paper.setAttribute('aria-hidden', 'false');
    burst(innerWidth / 2, innerHeight / 2, 8);
  });

  /* humor */
  const moods = {
    strong: ['You already know how to carry it all. Today, let it be enough.', 'Girl on Fire — Alicia Keys'],
    soft: ['Being soft is not the opposite of being strong. It is another way of being brave.', 'Just the Way You Are — Bruno Mars'],
    free: ['Go your own way. The world looks better from where you stand.', 'Flowers — Miley Cyrus'],
    tired: ['Rest. You do not have to prove anything today. I am here.', 'Count on Me — Bruno Mars']
  };
  const chips = document.querySelectorAll('.chip');
  chips.forEach((c) => c.addEventListener('click', () => {
    chips.forEach((o) => o.setAttribute('aria-pressed', o === c));
    const [t, s] = moods[c.dataset.mood];
    $('moodText').textContent = t;
    $('moodSong').textContent = '♪ ' + s;
  }));

  /* faixas — edite os textos "why" para deixar pessoal */
  const tracks = [
    ['Miss Independent', 'Ne-Yo', 'The one that started it all. This is the title, and the truth.'],
    ['She Got Her Own', 'Ne-Yo, Jamie Foxx, Fabolous', 'Because you build your own things.'],
    ['Girl on Fire', 'Alicia Keys', 'For the days you light up the whole room without trying.'],
    ['Flowers', 'Miley Cyrus', 'You are your own best company.'],
    ['Just Fine', 'Mary J. Blige', 'Your good mood is contagious.'],
    ['Masterpiece', 'Jessie J', 'A work in progress, and already a masterpiece.'],
    ['Strength, Courage & Wisdom', 'India.Arie', 'You carry all three.'],
    ["She's a Rainbow", 'The Rolling Stones', 'You bring color wherever you go.'],
    ['Just the Way You Are', 'Bruno Mars', 'No changes needed.'],
    ['Count on Me', 'Bruno Mars', 'Always.'],
    ['Bloom', 'The Paper Kites', 'Grow at your own pace.'],
    ['golden thing', 'Cody Simpson', 'Rare, and worth every bit of it.'],
    ['Until I Found You', 'Stephen Sanchez', 'Some people simply make things brighter.']
  ];
  const list = $('tracks');
  tracks.forEach(([n, a, w]) => {
    const li = document.createElement('li');
    li.innerHTML = `<button aria-expanded="false"><b></b><small></small></button><p class="why"></p>`;
    li.querySelector('b').textContent = n;
    li.querySelector('small').textContent = a;
    li.querySelector('.why').textContent = w;
    li.querySelector('button').addEventListener('click', (e) => {
      const on = li.classList.toggle('on');
      e.currentTarget.setAttribute('aria-expanded', on);
    });
    list.appendChild(li);
  });

  /* coroa */
  const crown = $('crown');
  const crownGo = () => {
    const r = crown.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top, 12);
  };
  crown.addEventListener('click', crownGo);
  crown.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && crownGo());

  /* coração final */
  const msgs = ['Tap the heart.', 'Again.', 'You deserve all of it.', 'Strong heart.', 'Kind soul.', 'Big dreams.', 'Independent.', 'And so much more.'];
  let n = 0;
  $('heartBtn').addEventListener('click', (e) => {
    n++;
    $('count').textContent = msgs[Math.min(n, msgs.length - 1)];
    const r = e.currentTarget.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top, 6);
  });

  /* pôr do sol esquenta com o scroll + parallax leve */
  const root = document.documentElement, photo = document.querySelector('.hero-photo');
  addEventListener('scroll', () => {
    root.style.setProperty('--warm', Math.min(scrollY / (document.body.scrollHeight - innerHeight), 1).toFixed(3));
  }, { passive: true });
  if (!still) addEventListener('pointermove', (e) => {
    photo.style.setProperty('--mx', ((e.clientX / innerWidth - .5) * -20) + 'px');
    photo.style.setProperty('--my', ((e.clientY / innerHeight - .5) * -14) + 'px');
  });
})();

/* ===== FOTOS: mural, reel, lightbox ===== */
(() => {
  const N = 42, g = (id) => document.getElementById(id);
  const src = (i) => `imagens/${i}.jpeg`;               // pasta "imagens" ao lado do index.html
  const ids = Array.from({ length: N }, (_, i) => i + 1);
  const caps = ['Strong heart', 'Kind soul', 'Big dreams', 'Independent', 'Bloom', 'Golden hour', 'Just you', 'Miss Independent'];
  const capOf = (i) => caps[(i - 1) % caps.length];

  /* lightbox */
  const lb = g('lb'); let cur = 1;
  const show = (i) => { cur = ((i - 1 + N) % N) + 1; g('lbImg').src = src(cur); g('lbCap').textContent = `${capOf(cur)} · ${cur}/${N}`; lb.hidden = false; document.body.style.overflow = 'hidden'; };
  const hide = () => { lb.hidden = true; document.body.style.overflow = ''; };
  g('lbX').onclick = hide; g('lbP').onclick = () => show(cur - 1); g('lbN').onclick = () => show(cur + 1);
  lb.addEventListener('click', (e) => e.target === lb && hide());
  addEventListener('keydown', (e) => { if (lb.hidden) return; if (e.key === 'Escape') hide(); if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });
  let sx = 0; lb.addEventListener('touchstart', (e) => sx = e.touches[0].clientX, { passive: true });
  lb.addEventListener('touchend', (e) => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) show(cur + (d < 0 ? 1 : -1)); });

  /* mural arrastável */
  const board = g('board'); let order = ids.slice(), tidy = false, z = 10, first = true;
  const snaps = ids.map((i) => {
    const d = document.createElement('figure'); d.className = 'snap';
    d.innerHTML = `<img src="${src(i)}" alt="" loading="lazy" decoding="async"><figcaption>${capOf(i)}</figcaption>`;
    d._s = { x: 0, y: 0, r: 0 }; board.appendChild(d);
    const put = () => d.style.transform = `translate(${d._s.x}px,${d._s.y}px) rotate(${d._s.r}deg)`; d._put = put;
    let px, py, ox, oy, on = false;
    d.addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch') return; on = true; d._m = false; px = e.clientX; py = e.clientY; ox = d._s.x; oy = d._s.y; d.setPointerCapture(e.pointerId); d.style.zIndex = ++z; d.classList.add('drag'); });
    d.addEventListener('pointermove', (e) => { if (!on) return; const dx = e.clientX - px, dy = e.clientY - py; if (Math.abs(dx) + Math.abs(dy) > 5) d._m = true; d._s.x = ox + dx; d._s.y = oy + dy; put(); });
    const up = () => { on = false; d.classList.remove('drag'); };
    d.addEventListener('pointerup', up); d.addEventListener('pointercancel', up);
    d.addEventListener('click', () => { if (!d._m) show(i); d._m = false; });
    return d;
  });
  let shown = 12;                                   // no celular, o mural mostra 12 e libera mais sob demanda
  const more = g('more');
  function layout(shuffle) {
    const w = board.clientWidth, mob = w < 600, cols = mob ? 2 : w < 1000 ? 5 : 7;
    const cw = w / cols, size = mob ? cw * .86 : Math.min(190, cw * 1.18), ch = size * 1.3;
    const vis = mob ? Math.min(shown, N) : N, rows = Math.ceil(vis / cols);
    board.style.height = rows * ch + (mob ? ch * .2 + 30 : 70) + 'px';
    more.classList.toggle('on', mob && vis < N);
    if (shuffle) order.sort(() => Math.random() - .5);
    order.forEach((id, k) => {
      const el = snaps[id - 1], c = k % cols, r = (k / cols) | 0, j = tidy ? 0 : 1;
      if (k >= vis) { el.style.display = 'none'; return; }
      if (el.style.display === 'none') { el.style.display = ''; void el.offsetWidth; }
      el.style.width = size + 'px'; el.style.transitionDelay = first ? k * 35 + 'ms' : '0ms';
      el._s = mob
        ? { x: c * cw + (cw - size) / 2 + (Math.random() - .5) * cw * .08, y: r * ch + 12 + (c ? ch * .2 : 0), r: (Math.random() - .5) * 6 }
        : { x: c * cw + (cw - size) / 2 + (Math.random() - .5) * cw * .45 * j, y: r * ch + 16 + (Math.random() - .5) * ch * .3 * j, r: (Math.random() - .5) * (tidy ? 3 : 24) };
      el._put(); el.classList.add('in');
    });
    first = false;
  }
  more.onclick = () => { shown += 12; layout(false); };
  new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { layout(false); o.disconnect(); } }, { rootMargin: '0px 0px -20% 0px' }).observe(board);
  g('shuffle').onclick = () => { tidy = false; layout(true); };
  g('tidy').onclick = () => { tidy = true; layout(false); };
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => !first && layout(false), 250); });

  /* reel */
  /* fotos parecidas ficam em "grupos"; o reel intercala os grupos e embaralha a cada visita */
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, k) => a + k);
  const groups = [range(26, 42), [2, 4, 5, 6, 7, 8, 9, 10, 11, 14], [20, 21, 22, 23, 24, 25], [1, 3, 12, 13, 15, 16, 17, 18, 19]];
  const rnd = (a) => a.sort(() => Math.random() - .5);
  const spread = (gs) => {                       // nunca coloca dois do mesmo grupo lado a lado
    for (let t = 0; t < 50; t++) {
      const left = gs.map((a) => a.slice()), out = []; let last = -1;
      while (left.some((a) => a.length)) {
        const opts = left.map((a, k) => [k, a.length]).filter(([k, n]) => n && k !== last);
        if (!opts.length) break;
        const max = Math.max(...opts.map((o) => o[1])), best = opts.filter((o) => o[1] >= max - 1);
        last = best[(Math.random() * best.length) | 0][0]; out.push(left[last].pop());
      }
      const grp = (i) => gs.findIndex((a) => a.includes(i));
      if (out.length === gs.flat().length && grp(out[0]) !== grp(out[out.length - 1])) return out;
    }
    return gs.flat();
  };
  if (innerWidth < 600) order = spread(groups.map((a) => rnd(a.slice())));
  const halves = [[], []]; groups.forEach((g0) => { const r = rnd(g0.slice()), h = Math.ceil(r.length / 2); halves[0].push(r.slice(0, h)); halves[1].push(r.slice(h)); });
  [[spread(halves[0]), 't1'], [spread(halves[1]), 't2']].forEach(([row, id]) => {
    g(id).innerHTML = [...row, ...row].map((i) => `<img src="${src(i)}" alt="" loading="lazy" data-i="${i}">`).join('');
    g(id).addEventListener('click', (e) => e.target.dataset.i && show(+e.target.dataset.i));
  });

  /* foto do humor */
  const mp = { strong: 5, soft: 24, free: 2, tired: 1 };
  document.querySelectorAll('.chip[data-mood]').forEach((c) => c.addEventListener('click', () => {
    const p = g('moodPhoto'); p.hidden = false; p.style.animation = 'none'; void p.offsetWidth; p.style.animation = ''; p.src = src(mp[c.dataset.mood]);
  }));
})();

(function () {
  var P = window.AB_PRICES;
  var BOOK = 'http://n2248647.yclients.com/';
  // часы работы: [открытие, закрытие] в часах, Пн = 0; null = выходной
  var HOURS = [[9.5, 21], null, [9.5, 21], [9.5, 21], [9.5, 21], [11, 20], [11, 20]];
  var DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
  var DAYS_ACC = ['в понедельник', 'во вторник', 'в среду', 'в четверг', 'в пятницу', 'в субботу', 'в воскресенье'];
  var MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

  function rub(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function hm(h) { var m = Math.round((h % 1) * 60); return Math.floor(h) + ':' + (m < 10 ? '0' : '') + m; }

  // --- подбор ухода ---
  var CARE = {
    back:  { img: 'back.webp', alt: 'Массаж спины', text: 'Сидячая работа, тяжесть в плечах, зажатая шея. Начните с массажа спины или воротниковой зоны, а для глубокой проработки возьмите общий массаж.',
             items: [['Массаж шейно-воротниковой зоны', 1000, '20 мин'], ['Массаж спины', 2000, '30 мин'], ['Общий массаж тела', 3200, '60 мин']] },
    swell: { img: 'lpg.webp', alt: 'LPG массаж', text: 'Ноги к вечеру как чужие, утром лицо «плывёт». Лимфодренаж руками и LPG мягко выводят лишнюю жидкость.',
             items: [['Лимфодренажный массаж', 3500, '60 мин'], ['LPG массаж', 2700, '50 мин'], ['Изоджей тело', 1700, '45 мин']] },
    body:  { img: 'legs.webp', alt: 'Антицеллюлитный массаж ног', text: 'Целлюлит и лишние сантиметры лучше всего уходят курсом. Сочетаем ручной антицеллюлитный массаж с аппаратами.',
             items: [['Антицеллюлитный массаж', 3500, '60 мин'], ['LPG 35 + транзион, 1 зона', 3000, '75 мин'], ['Транзион, 2 зоны', 3000, '40 мин']] },
    face:  { img: 'face.webp', alt: 'Массаж лица', text: 'Отёчность, уставшее лицо, хочется более чёткий овал. Ручной массаж лица отлично сочетается с микротоками и изоджей.',
             items: [['Массаж лица', 2000, '40 мин'], ['Микротоки', 1700, '40 мин'], ['Массаж лица + изоджей лицо', 3200, '90 мин']] },
    relax: { img: 'neck.webp', alt: 'Расслабляющий массаж', text: 'Никаких задач, просто час тишины и заботы о себе. Отличный вариант для первого знакомства.',
             items: [['Общий массаж тела', 3200, '60 мин'], ['Массаж лица', 2000, '40 мин']] }
  };
  var pick = document.getElementById('pick');
  function showCare(key) {
    var c = CARE[key];
    pick.innerHTML =
      '<figure class="pick__img"><img src="img/' + c.img + '" alt="' + esc(c.alt) + '"></figure>' +
      '<div class="pick__body"><p class="pick__text">' + esc(c.text) + '</p><ul class="pick__list">' +
      c.items.map(function (it) {
        return '<li><span>' + esc(it[0]) + '<small>' + it[2] + '</small></span><b>' + rub(it[1]) + '</b></li>';
      }).join('') +
      '</ul><a class="btn btn--gold" href="' + BOOK + '" target="_blank" rel="noopener">Записаться</a></div>';
    pick.classList.remove('is-anim'); void pick.offsetWidth; pick.classList.add('is-anim');
  }
  var chips = document.querySelectorAll('.chip');
  chips.forEach(function (ch) {
    ch.addEventListener('click', function () {
      chips.forEach(function (x) { x.classList.remove('is-active'); x.setAttribute('aria-selected', 'false'); });
      ch.classList.add('is-active'); ch.setAttribute('aria-selected', 'true');
      showCare(ch.dataset.care);
    });
  });
  showCare('back');

  // --- прайс ---
  var list = document.getElementById('priceList');
  function renderPrices(key) {
    if (key === 'passes') {
      list.innerHTML = '<div class="passes"><div class="passes__head"><span>Процедура</span><span>5 сеансов</span><span>10 сеансов</span></div>' +
        P.passes.map(function (r) {
          var s5 = r[1] * 5 - r[2], s10 = r[1] * 10 - r[3];
          return '<div class="passes__row"><span class="passes__name">' + esc(r[0]) + '<small>разово ' + rub(r[1]) + '</small></span>' +
            '<span><b>' + rub(r[2]) + '</b>' + (s5 > 0 ? '<i>выгода ' + rub(s5) + '</i>' : '') + '</span>' +
            '<span><b>' + rub(r[3]) + '</b>' + (s10 > 0 ? '<i>выгода ' + rub(s10) + '</i>' : '') + '</span></div>';
        }).join('') + '</div>';
      return;
    }
    list.innerHTML = '<ul class="plist">' + P[key].map(function (r) {
      return '<li><div class="plist__row"><span>' + esc(r[0]) + '</span><i aria-hidden="true"></i><b>' + rub(r[1]) + '</b></div>' +
        '<small>' + r[2] + (r[3] ? ' · ' + esc(r[3]) : '') + '</small></li>';
    }).join('') + '</ul>';
  }
  var tabs = document.querySelectorAll('.tab');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.remove('is-active'); x.setAttribute('aria-selected', 'false'); });
      t.classList.add('is-active'); t.setAttribute('aria-selected', 'true');
      renderPrices(t.dataset.tab);
    });
  });
  renderPrices('hands');

  // --- листок календаря: открыто / закрыто (по Москве) ---
  var msk = new Date(Date.now() + (new Date().getTimezoneOffset() + 180) * 60000);
  var d = (msk.getDay() + 6) % 7, h = msk.getHours() + msk.getMinutes() / 60;
  var today = HOURS[d], state, open = false;
  if (today && h >= today[0] && h < today[1]) { open = true; state = 'принимаю до ' + hm(today[1]); }
  else if (today && h < today[0]) { state = 'открою в ' + hm(today[0]); }
  else {
    var k = 1; while (!HOURS[(d + k) % 7]) k++;
    var nd = (d + k) % 7;
    state = (today ? 'уже закрыто' : 'выходной') + ' · жду ' + (k === 1 ? 'завтра' : DAYS_ACC[nd]) + ' с ' + hm(HOURS[nd][0]);
  }
  document.getElementById('calMonth').textContent = MONTHS[msk.getMonth()];
  document.getElementById('calDay').textContent = msk.getDate();
  document.getElementById('calWeek').textContent = DAYS[d].toLowerCase();
  document.getElementById('calState').textContent = state;
  document.getElementById('cal').classList.add(open ? 'is-open' : 'is-closed');

  document.getElementById('week').innerHTML = DAYS.map(function (n, i) {
    return '<li' + (i === d ? ' class="is-today"' : '') + '><span>' + n + '</span><span>' +
      (HOURS[i] ? hm(HOURS[i][0]) + '–' + hm(HOURS[i][1]) : 'выходной') + '</span></li>';
  }).join('');

  // --- отзывы-слайдер ---
  var slider = document.getElementById('slider'), count = document.getElementById('count');
  var slides = slider.querySelectorAll('.q');
  function cur() { return Math.round(slider.scrollLeft / slides[0].offsetWidth); }
  function go(i) { i = Math.max(0, Math.min(slides.length - 1, i)); slider.scrollTo({ left: slides[i].offsetLeft - slider.offsetLeft, behavior: 'smooth' }); }
  document.getElementById('prev').addEventListener('click', function () { go(cur() - 1); });
  document.getElementById('next').addEventListener('click', function () { go(cur() + 1); });
  slider.addEventListener('scroll', function () { count.textContent = (cur() + 1) + ' / ' + slides.length; }, { passive: true });

  // --- header ---
  var top = document.querySelector('.top');
  var onScroll = function () { top.classList.toggle('is-solid', window.scrollY > 30); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var burger = document.getElementById('burger'), nav = document.getElementById('nav');
  burger.addEventListener('click', function () {
    var o = document.body.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded', o);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { document.body.classList.remove('nav-open'); burger.setAttribute('aria-expanded', 'false'); }
  });

  // --- reveal ---
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('is-in'); });
  }
})();

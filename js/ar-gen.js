/* ============================================================
   app.js  —  Activity Report Generator
   ============================================================ */
(function () {

  /* ══════════════════════════════════════════════════════════
     SUGGESTED LOGOS
     Add your image files to the images/ folder next to the
     HTML file and list them here.  Any entry whose file is
     missing will be hidden automatically.
  ══════════════════════════════════════════════════════════ */
  const SUGGESTED = [
    { label: 'MCGI Youth', src: '../images/mcgi-youth.jpg'  },
    { label: 'South',      src: '../images/south-kktk.png'  },
    { label: 'GCOS',       src: '../images/gcos.png'       },
    { label: 'BREAD',      src: '../images/bread.png'        },
    { label: 'MD',         src: '../images/md.png'        },
    { label: 'TK',         src: '../images/tk.png'     },
    { label: 'AG',         src: '../images/ag.png'       },
    { label: 'TYC',        src: '../images/tyc.png'       },
    { label: 'TPYC',       src: '../images/tpyc.png'       }
  ];

  /* ══ STATE ══ */
  const imgs = [];          // { src, name, w, h }
  let logoLeft  = null;
  let logoRight = null;
  let selLeft   = -1;
  let selRight  = -1;

  const LAYOUTS = {
    0: 'No images',
    1: 'Natural ratio',
    2: 'Top + Bottom',
    3: 'Hero + Pair',
    4: '2×2 Grid',
  };

  /* ══ DOM REFS ══ */
  const dropZone    = document.getElementById('drop-zone');
  const fileInput   = document.getElementById('file-input');
  const thumbsEl    = document.getElementById('thumbs');
  const slotsLabel  = document.getElementById('slots-label');
  const countPill   = document.getElementById('count-pill');
  const countText   = document.getElementById('count-text');
  const layoutPill  = document.getElementById('layout-pill');
  const previewArea = document.getElementById('preview-area');
  const overlay     = document.getElementById('saving-overlay');

  /* Default date */
  const nd = new Date();
  document.getElementById('f-date').value =
    nd.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric',
      month: 'long',   day:  'numeric',
    });

  /* ══════════════════════════════════════════════════════════
     SUGGESTED LOGOS UI
  ══════════════════════════════════════════════════════════ */
  function tryLoad(imgEl) {
    imgEl.onerror = function () {
      const tile = imgEl.closest('.sug-logo');
      if (tile) tile.style.display = 'none';
    };
  }

  function toDataURL(src, cb) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
      const c = document.createElement('canvas');
      c.width  = img.naturalWidth;
      c.height = img.naturalHeight;
      c.getContext('2d').drawImage(img, 0, 0);
      cb(c.toDataURL('image/png'));
    };
    img.onerror = function () { cb(src); };
    img.src = src + '?v=' + Date.now();
  }

  function checkSugEmpty(containerId) {
    setTimeout(function () {
      const container = document.getElementById(containerId);
      if (!container) return;
      const visible = Array.from(container.querySelectorAll('.sug-logo'))
                           .some(t => t.style.display !== 'none');
      const notice = document.getElementById(containerId + '-notice');
      if (notice) notice.style.display = visible ? 'none' : 'block';
    }, 600);
  }

  function buildSuggestedUI(containerId, side) {
    const container = document.getElementById(containerId);

    /* "No logos found" notice */
    const notice = document.createElement('div');
    notice.className = 'sug-empty-notice';
    notice.id        = containerId + '-notice';
    notice.textContent = 'Place logos in images/ folder';

    SUGGESTED.forEach(function (s, i) {
      const tile = document.createElement('div');
      tile.className = 'sug-logo';
      tile.title     = s.label;

      const img = document.createElement('img');
      img.src = s.src;
      img.alt = s.label;
      tryLoad(img);
      tile.appendChild(img);

      tile.addEventListener('click', function () {
        if (img.naturalWidth === 0) return;
        toDataURL(img.src, function (dataUrl) {
          selectSuggested(side, i, dataUrl, tile);
        });
      });

      container.appendChild(tile);
    });

    container.appendChild(notice);
    checkSugEmpty(containerId);
  }

  buildSuggestedUI('sug-left',  'left');
  buildSuggestedUI('sug-right', 'right');

  function selectSuggested(side, idx, src, tileEl) {
    if (side === 'left') {
      selLeft  = idx;
      logoLeft = src;
      updateLogoBox('logo-left-box', src, 'left');
      highlightSug('sug-left', tileEl);
    } else {
      selRight  = idx;
      logoRight = src;
      updateLogoBox('logo-right-box', src, 'right');
      highlightSug('sug-right', tileEl);
    }
  }

  function highlightSug(containerId, activeTile) {
    const c = document.getElementById(containerId);
    if (!c) return;
    c.querySelectorAll('.sug-logo').forEach(function (el) {
      el.classList.toggle('selected', el === activeTile);
    });
  }

  function updateLogoBox(boxId, src, side) {
    document.getElementById(boxId).innerHTML =
      '<img src="' + src + '" alt="logo" style="max-width:100%;max-height:52px;object-fit:contain;">' +
      '<button class="logo-del" onclick="clearLogo(\'' + side + '\',event)">&#10005;</button>';
  }

  window.clearLogo = function (side, e) {
    e.stopPropagation();
    if (side === 'left') {
      logoLeft  = null; selLeft  = -1;
      document.getElementById('logo-left-box').innerHTML  = '<span class="placeholder-txt">+ Upload</span>';
      highlightSug('sug-left',  null);
    } else {
      logoRight = null; selRight = -1;
      document.getElementById('logo-right-box').innerHTML = '<span class="placeholder-txt">+ Upload</span>';
      highlightSug('sug-right', null);
    }
  };

  /* File upload for each logo slot */
  ['left', 'right'].forEach(function (side) {
    document.getElementById('logo-' + side + '-box')
      .addEventListener('click', function (e) {
        if (e.target.classList.contains('logo-del')) return;
        document.getElementById('logo-' + side + '-input').click();
      });

    document.getElementById('logo-' + side + '-input')
      .addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;
        const r = new FileReader();
        r.onload = function (ev) {
          if (side === 'left') { logoLeft  = ev.target.result; selLeft  = -1; highlightSug('sug-left',  null); }
          else                 { logoRight = ev.target.result; selRight = -1; highlightSug('sug-right', null); }
          updateLogoBox('logo-' + side + '-box', ev.target.result, side);
        };
        r.readAsDataURL(file);
        this.value = '';
      });
  });

  /* ══════════════════════════════════════════════════════════
     PHOTO DROP ZONE
  ══════════════════════════════════════════════════════════ */
  dropZone.addEventListener('click',     function ()  { fileInput.click(); });
  dropZone.addEventListener('dragover',  function (e) { e.preventDefault(); dropZone.classList.add('drag-over'); });
  dropZone.addEventListener('dragleave', function ()  { dropZone.classList.remove('drag-over'); });
  dropZone.addEventListener('drop',      function (e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    handleFiles(e.dataTransfer.files);
  });
  fileInput.addEventListener('change', function () { handleFiles(this.files); this.value = ''; });

  function handleFiles(files) {
    const rem   = 4 - imgs.length;
    const valid = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, rem);
    if (!valid.length) return;

    let loaded = 0;
    valid.forEach(function (file) {
      const r = new FileReader();
      r.onload = function (e) {
        const src   = e.target.result;
        const probe = new Image();
        probe.onload = function () {
          imgs.push({ src, name: file.name, w: probe.naturalWidth, h: probe.naturalHeight });
          loaded++;
          if (loaded === valid.length) refreshUI();
        };
        probe.src = src;
      };
      r.readAsDataURL(file);
    });
  }

  window.removeImg = function (i) { imgs.splice(i, 1); refreshUI(); };

  function refreshUI() {
    const n = imgs.length;
    thumbsEl.innerHTML = '';
    imgs.forEach(function (img, i) {
      const d = document.createElement('div');
      d.className  = 'thumb';
      d.innerHTML  =
        '<img src="' + img.src + '">' +
        '<span class="thumb-num">#' + (i + 1) + '</span>' +
        '<button class="thumb-del" onclick="removeImg(' + i + ')">&#10005;</button>';
      thumbsEl.appendChild(d);
    });

    if (n > 0) {
      countPill.style.display = 'flex';
      countText.textContent   = n + '/4 \xB7 ' + LAYOUTS[n];
    } else {
      countPill.style.display = 'none';
    }

    slotsLabel.textContent = n >= 4
      ? 'Maximum reached (4/4)'
      : (4 - n) + ' slot' + (4 - n !== 1 ? 's' : '') + ' remaining';

    dropZone.classList.toggle('disabled', n >= 4);
    layoutPill.textContent = n > 0
      ? n + ' photo' + (n > 1 ? 's' : '') + ' \xB7 ' + LAYOUTS[n]
      : 'No images yet';
  }

  /* ══════════════════════════════════════════════════════════
     GENERATE
  ══════════════════════════════════════════════════════════ */
  document.getElementById('gen-btn').addEventListener('click', generate);

  function g(id) { return document.getElementById(id).value.trim(); }

  function generate() {
    const data = {
      orgName:      g('f-orgname')      || 'ORGANIZATION',
      orgSub:       g('f-orgsub')       || '',
      title:        g('f-title')        || 'Activity Report',
      date:         g('f-date')         || '',
      time:         g('f-time')         || '',
      venue:        g('f-venue')        || '',
      participants: g('f-participants') || '',
      author:       g('f-author')       || '',
      images:       imgs.slice(),
    };
    const n = data.images.length;

    previewArea.innerHTML =
      '<div class="preview-bar">' +
        '<span class="preview-label">' +
          n + ' photo' + (n !== 1 ? 's' : '') +
          ' \xB7 ' + (LAYOUTS[n] || 'No images') +
        '</span>' +
        '<div class="btn-row">' +
          '<button class="action-btn" id="btn-html">Export HTML ↓</button>' +
          '<button class="action-btn primary" id="btn-img">📷 Save as Image ↓</button>' +
        '</div>' +
      '</div>' +
      '<div id="report-wrapper">' + buildCard(data) + '</div>';

    document.getElementById('btn-img') .addEventListener('click', function () { saveImage(data); });
    document.getElementById('btn-html').addEventListener('click', function () { saveHTML(data);  });
  }

  /* ══════════════════════════════════════════════════════════
     BUILD REPORT CARD HTML
  ══════════════════════════════════════════════════════════ */
  function buildCard(data) {
    /* Logos — appear beside the org name, not at outer edges */
    const lLogo = logoLeft
      ? '<img src="' + logoLeft  + '" style="max-width:72px;max-height:72px;object-fit:contain;">'
      : '';
    const rLogo = logoRight
      ? '<img src="' + logoRight + '" style="max-width:72px;max-height:72px;object-fit:contain;">'
      : '';

    /* Meta columns — label bold, value normal weight */
    const metaItems = [
      data.date         ? '<div class="rc-meta-item"><span class="rc-label">DATE:</span> '                  + esc(data.date)         + '</div>' : '',
      data.time         ? '<div class="rc-meta-item"><span class="rc-label">TIME:</span> '                  + esc(data.time)         + '</div>' : '',
      data.venue        ? '<div class="rc-meta-item"><span class="rc-label">VENUE:</span> '                 + esc(data.venue)        + '</div>' : '',
      data.participants ? '<div class="rc-meta-item"><span class="rc-label">NUMBER OF PARTICIPANTS:</span> ' + esc(data.participants) + '</div>' : '',
    ];
    const col1 = [metaItems[0], metaItems[2]].join('');
    const col2 = [metaItems[1], metaItems[3]].join('');
    const metaHTML = (col1 || col2)
      ? '<div class="rc-meta"><div>' + col1 + '</div><div>' + col2 + '</div></div>'
      : '';

    const photosHTML = buildPhotosHTML(data.images);

    return (
      '<div id="report-card">' +

        /* Logo bar: left logo | centre text | right logo — all centred as a unit */
        '<div class="rc-logo-bar">' +
          '<div class="rc-logo-slot">' + lLogo + '</div>' +
          '<div class="rc-header-center">' +
            '<div class="rc-org-name">' + esc(data.orgName) + '</div>' +
            (data.orgSub ? '<div class="rc-org-sub">' + esc(data.orgSub) + '</div>' : '') +
          '</div>' +
          '<div class="rc-logo-slot">' + rLogo + '</div>' +
        '</div>' +

        '<div class="rc-title-section">' +
          '<div class="rc-report-title">' + esc(data.title) + '</div>' +
        '</div>' +

        metaHTML +

        (photosHTML ? '<div class="rc-photos">' + photosHTML + '</div>' : '') +

        '<div class="rc-footer">' +
          (data.author ? '<span class="rc-label">PREPARED BY:</span> ' + esc(data.author) : '') +
        '</div>' +

      '</div>'
    );
  }

  /* ══════════════════════════════════════════════════════════
     PHOTO LAYOUTS
     On desktop the card is 650px wide; on mobile it's fluid.
     We compute the actual usable width at build time so photos
     always fill the card correctly at any screen size.

     n=1  full width, natural aspect ratio
     n=2  top + bottom, each at natural ratio
     n=3  hero (natural ratio) + pair side-by-side below
     n=4  2×2 grid (two rows of two)
  ══════════════════════════════════════════════════════════ */

  function getUsable() {
    /* padding is 14px each side on mobile, 22px on desktop (≥900px) */
    const pad = window.innerWidth >= 900 ? 44 : 28;
    const cardW = Math.min(window.innerWidth, 650);
    return cardW - pad;
  }

  function buildPhotosHTML(images) {
    const n      = images.length;
    const GAP    = 4;
    const USABLE = getUsable();
    if (n === 0) return '';

    /* n=1 — single image at natural ratio */
    if (n === 1) {
      const img   = images[0];
      const dispH = Math.round(USABLE * (img.h / img.w));
      return (
        '<div style="display:flex;flex-direction:column;gap:' + GAP + 'px;">' +
          '<div style="width:100%;height:' + dispH + 'px;overflow:hidden;border:2px solid #111;border-radius:2px;">' +
            '<img src="' + img.src + '" style="width:100%;height:100%;object-fit:cover;display:block;">' +
          '</div>' +
        '</div>'
      );
    }

    /* n=2 — stacked top + bottom, each natural ratio */
    if (n === 2) {
      function block2(img) {
        const dispH = Math.round(USABLE * (img.h / img.w));
        return (
          '<div style="width:100%;height:' + dispH + 'px;overflow:hidden;border:2px solid #111;border-radius:2px;">' +
            '<img src="' + img.src + '" style="width:100%;height:100%;object-fit:cover;display:block;">' +
          '</div>'
        );
      }
      return (
        '<div style="display:flex;flex-direction:column;gap:' + GAP + 'px;">' +
          block2(images[0]) + block2(images[1]) +
        '</div>'
      );
    }

    /* n=3 — hero + pair */
    if (n === 3) {
      const hero  = images[0];
      const heroH = Math.round(USABLE * (hero.h / hero.w));
      const cellW = Math.floor((USABLE - GAP) / 2);
      const left  = images[1];
      const right = images[2];
      const pairH = Math.max(
        Math.round(cellW * (left.h  / left.w)),
        Math.round(cellW * (right.h / right.w))
      );
      return (
        '<div style="display:flex;flex-direction:column;gap:' + GAP + 'px;">' +
          '<div style="width:100%;height:' + heroH + 'px;overflow:hidden;border:2px solid #111;border-radius:2px;">' +
            '<img src="' + hero.src + '" style="width:100%;height:100%;object-fit:cover;display:block;">' +
          '</div>' +
          '<div style="display:flex;gap:' + GAP + 'px;">' +
            '<div style="flex:1;height:' + pairH + 'px;overflow:hidden;border:2px solid #111;border-radius:2px;">' +
              '<img src="' + left.src  + '" style="width:100%;height:100%;object-fit:cover;display:block;">' +
            '</div>' +
            '<div style="flex:1;height:' + pairH + 'px;overflow:hidden;border:2px solid #111;border-radius:2px;">' +
              '<img src="' + right.src + '" style="width:100%;height:100%;object-fit:cover;display:block;">' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }

    /* n=4 — 2 top + 2 bottom */
    if (n === 4) {
      const cellW = Math.floor((USABLE - GAP) / 2);

      function row4(imgA, imgB) {
        const rowH = Math.round(
          (Math.round(cellW * (imgA.h / imgA.w)) +
           Math.round(cellW * (imgB.h / imgB.w))) / 2
        );
        return (
          '<div style="display:flex;gap:' + GAP + 'px;">' +
            '<div style="flex:1;height:' + rowH + 'px;overflow:hidden;border:2px solid #111;border-radius:2px;">' +
              '<img src="' + imgA.src + '" style="width:100%;height:100%;object-fit:cover;display:block;">' +
            '</div>' +
            '<div style="flex:1;height:' + rowH + 'px;overflow:hidden;border:2px solid #111;border-radius:2px;">' +
              '<img src="' + imgB.src + '" style="width:100%;height:100%;object-fit:cover;display:block;">' +
            '</div>' +
          '</div>'
        );
      }

      return (
        '<div style="display:flex;flex-direction:column;gap:' + GAP + 'px;">' +
          row4(images[0], images[1]) +
          row4(images[2], images[3]) +
        '</div>'
      );
    }

    return '';
  }

  /* ══════════════════════════════════════════════════════════
     SAVE AS IMAGE  (natural size — no fixed dimensions)
  ══════════════════════════════════════════════════════════ */
  function saveImage(data) {
    const card = document.getElementById('report-card');
    if (!card) return;

    overlay.classList.add('show');

    html2canvas(card, {
      scale: 2,           /* 2× for high-DPI sharpness */
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    }).then(function (canvas) {
      overlay.classList.remove('show');
      const a = document.createElement('a');
      a.download = (data.title || 'activity-report').replace(/\s+/g, '-').toLowerCase() + '.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
    }).catch(function (err) {
      overlay.classList.remove('show');
      alert('Could not save image: ' + err.message);
    });
  }

  /* ══════════════════════════════════════════════════════════
     EXPORT HTML
  ══════════════════════════════════════════════════════════ */
  function saveHTML(data) {
    const card = document.getElementById('report-card');
    if (!card) return;

    const gFonts = 'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800;900&family=Bebas+Neue&display=swap';

    const parts = [
      '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">',
      '<meta name="viewport" content="width=device-width,initial-scale=1">',
      '<title>' + esc(data.title) + '</' + 'title>',
      '<link rel="preconnect" href="https://fonts.googleapis.com">',
      '<link href="' + gFonts + '" rel="stylesheet">',
      '<style>',
      'body{margin:0;padding:40px;background:#eee;display:flex;justify-content:center;',
      '     font-family:"Gotham","Gotham HTF","Nunito Sans","Century Gothic","Trebuchet MS",Arial,sans-serif;}',
      '#report-card{width:650px;background:#fff;display:flex;flex-direction:column;',
      '             font-family:"Gotham","Gotham HTF","Nunito Sans","Century Gothic","Trebuchet MS",Arial,sans-serif;}',
      '.rc-logo-bar{background:#fff;padding:14px 22px 10px;display:flex;align-items:center;justify-content:center;gap:16px;border-bottom:3px solid #e8a800;}',
      '.rc-logo-slot{width:72px;height:72px;display:flex;align-items:center;justify-content:center;}',
      '.rc-logo-slot img{max-width:72px;max-height:72px;object-fit:contain;}',
      '.rc-header-center{text-align:center;}',
      '.rc-org-name{font-family:"Gotham","Gotham HTF","Nunito Sans","Century Gothic",Arial,sans-serif;font-size:34px;font-weight:900;color:#1565c0;line-height:1;text-transform:uppercase;letter-spacing:.05em;}',
      '.rc-org-sub{font-size:11px;font-weight:700;color:#555;letter-spacing:.12em;text-transform:uppercase;margin-top:5px;border-top:2px solid #e8a800;padding-top:4px;display:inline-block;}',
      '.rc-title-section{background:#fff;text-align:center;padding:12px 22px 10px;border-bottom:1px solid #e0e0e0;}',
      '.rc-report-title{font-family:"Gotham","Gotham HTF","Nunito Sans","Century Gothic",Arial,sans-serif;font-size:22px;font-weight:800;color:#111;text-transform:uppercase;letter-spacing:.06em;line-height:1.2;}',
      '.rc-meta{background:#fff;padding:8px 22px 10px;display:grid;grid-template-columns:1fr 1fr;gap:1px 12px;border-bottom:1px solid #e0e0e0;}',
      '.rc-meta-item{font-size:12px;color:#1a1a1a;line-height:1.6;font-weight:400;}',
      '.rc-label{font-weight:700;}',
      '.rc-photos{padding:10px 22px 0;}',
      '.rc-footer{background:#fff;border-top:3px solid #e8a800;padding:10px 22px;font-size:13px;color:#1a1a1a;margin-top:10px;font-weight:400;}',
      'img{display:block;}',
      '</' + 'style></' + 'head><body>',
      card.outerHTML,
      '</' + 'body></' + 'html>',
    ];

    const blob = new Blob(parts, { type: 'text/html' });
    const a = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = (data.title || 'activity-report').replace(/\s+/g, '-').toLowerCase() + '.html';
    a.click();
  }

  /* ══ UTILS ══ */
  function esc(s) {
    return String(s || '')
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;');
  }

  refreshUI();

})();
/* Acc Cell WebApp — penghubung akhir: tombol aksi di header/navigasi/menu, lalu mulai aplikasi.
 * © Nabire Kreatif — template berlisensi */
(function () {
  'use strict';
  const A = window.App;
  document.addEventListener('click', e => {
    if (e.target.closest('[data-install]')) { e.preventDefault(); A.install(); return; }
    const t = e.target.closest('[data-act]'); if (!t) return;
    const act = t.dataset.act; e.preventDefault();
    if (act === 'menu' && A.openMenu) A.openMenu();
    else if (act === 'cs') { const nm = (A.pub && A.pub.settings && A.pub.settings.nama_toko) || 'Acc Cell';
      A.pickBranch(b => 'Halo Admin ' + nm + ' ' + A.cabNama(b.id) + ', saya ingin bertanya.', { title: 'Customer Service ' + nm }); }
    else if (act === 'install') A.install();
    else if (act === 'tema') A.setTheme(A.theme() === 'gelap' ? 'terang' : 'gelap');
    else if (act === 'share' && A.shareSheet) A.shareSheet();
  });
  A.start();
})();

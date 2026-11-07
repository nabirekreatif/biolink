/* ==========================================================================
 *  KONFIGURASI ACC CELL WEBAPP — berkas ini BEBAS DIEDIT (tidak disegel lisensi)
 * --------------------------------------------------------------------------
 *  1. Deploy backend Apps Script (Deploy → New deployment → Web app,
 *     Execute as: Me, Who has access: Anyone) lalu salin URL yang berakhiran /exec.
 *  2. Tempel URL itu di GAS_URL di bawah (di antara tanda kutip).
 *  3. Simpan, lalu git add . → git commit → git push.
 *
 *  Bila GAS_URL kosong, halaman tampil dalam MODE DEMO memakai data contoh bawaan.
 * ========================================================================== */
window.ACC_CONFIG = {
  GAS_URL: 'https://script.google.com/macros/s/AKfycbwpByeagmBTmRLiLYZ8WVvvnWSxR27uC4GXcMD-pm4UK49rCGp7kOkvyy7HLzRc7m6R/exec',                       // contoh: 'https://script.google.com/macros/s/AKfycb.../exec'
  NAMA_USAHA: 'Acc Cell',            // tampil di hak cipta saat template berlisensi
  FRESH_DETIK: 60                    // data publik dianggap segar selama 60 detik (tanpa panggil server)
};

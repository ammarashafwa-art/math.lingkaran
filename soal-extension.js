// ===== TAMBAH SOAL BARU =====
// Data pemain dari navbar
let currentPlayer = {
  nama: 'RR. Ammara Nadya Shafwa',
  presensi: 30
};

// Simpan soal baru ke localStorage
function tambahSoalBaru() {
  const kategori = document.getElementById('inputKategori').value;
  const level = document.getElementById('inputLevel').value;
  const soalText = document.getElementById('inputSoal').value.trim();
  const jawabanText = document.getElementById('inputJawaban').value.trim();

  if (!soalText || !jawabanText) {
    showToast('⚠️ Soal dan Jawaban tidak boleh kosong!', '#f59e0b');
    return;
  }

  // Ambil soal baru dari localStorage atau buat array baru
  let soalBaru = JSON.parse(localStorage.getItem('gm_soal_baru') || '[]');
  
  // Generate nomor otomatis (mulai dari 21 karena soal original 20)
  const nomorBaru = soalBaru.length + 21;
  
  const newSoal = {
    num: String(nomorBaru).padStart(2, '0'),
    cat: kategori,
    level: level,
    q: soalText,
    ans: jawabanText,
    author: currentPlayer.nama,
    presensi: currentPlayer.presensi,
    date: new Date().toLocaleDateString('id-ID')
  };

  soalBaru.push(newSoal);
  localStorage.setItem('gm_soal_baru', JSON.stringify(soalBaru));

  // Clear form
  document.getElementById('inputSoal').value = '';
  document.getElementById('inputJawaban').value = '';
  
  showToast('✅ Soal berhasil ditambahkan! +10 XP 🎉', '#10b981');
  addXP(10);
  
  // Refresh tampilan soal
  renderSoalDenganBaru();
  
  // Scroll ke soal list
  setTimeout(() => {
    document.querySelector('#soal-list').scrollIntoView({ behavior: 'smooth' });
  }, 300);
}

// Render soal original + soal baru
function renderSoalDenganBaru() {
  const list = document.getElementById('soal-list');
  const soalBaru = JSON.parse(localStorage.getItem('gm_soal_baru') || '[]');
  
  // Gabung soal original dengan soal baru
  const allSoal = [...soalData, ...soalBaru];
  
  list.innerHTML = allSoal.map(s => `
    <div class="soal-card" data-cat="${s.cat}">
      <div class="soal-header">
        <span class="soal-num">${s.num}</span>
        <span class="soal-cat">${s.cat.replace('-',' ')}</span>
        <span class="soal-level ${s.level}">${s.level==='easy'?'⭐ Mudah':s.level==='medium'?'⭐⭐ Sedang':'⭐⭐⭐ Sulit'}</span>
        ${soalBaru.some(b => b.num === s.num) ? '<span style="background:#7c3aed; color:#fff; padding:0.2rem 0.6rem; border-radius:6px; font-size:0.7rem; margin-left:0.5rem">✍️ BARU</span>' : ''}
      </div>
      <p class="soal-text">${s.q}</p>
      <button class="btn-toggle-ans" onclick="toggleAnswer('ans-${s.num}', this)">📖 Lihat Pembahasan</button>
      <div id="ans-${s.num}" class="soal-answer hidden" style="margin-top:1rem; padding:1rem; background:rgba(16,185,129,0.1); border-left:3px solid #10b981; border-radius:8px; color:#a7f3d0; font-size:0.9rem">
        ${s.ans}
      </div>
    </div>`).join('');
}

// ===== TAMPILKAN KOORDINAT DI CIRCLE SHOOTER =====
// Inject ke dalam shooterLoop() - harus dipanggil setelah circle digambar
function drawShooterCoordinates(ctx, circle, scale = 30) {
  // Tampilkan koordinat X, Y di bawah lingkaran
  ctx.fillStyle = 'rgba(0,212,255,0.8)';
  ctx.font = 'bold 10px "Exo 2", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  
  const coordX = Math.round((circle.x - 300) / scale);
  const coordY = Math.round((170 - circle.y) / scale);
  
  ctx.fillText(`X:${coordX}`, circle.x, circle.y + 50);
  ctx.fillText(`Y:${coordY}`, circle.x, circle.y + 62);
}

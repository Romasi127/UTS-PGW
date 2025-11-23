async function ambilFoto() {
  const response = await fetch('https://api.thecatapi.com/v1/images/search?limit=6');
  const data = await response.json();
  const container = document.getElementById('galeri-container');

  data.forEach(foto => {
    const div = document.createElement('div');
    div.className = 'foto-item';
    div.innerHTML = `
      <img src="${foto.url}" alt="Kucing Lucu">
      <p><strong>ID: ${foto.id}</strong></p>
      <div class="komentar"></div>
      <form>
        <input type="text" name="isi_komentar" placeholder="Tulis komentar..." required>
        <button type="submit">Kirim</button>
      </form>
    `;
    container.appendChild(div);

    const komentarDiv = div.querySelector('.komentar');
    muatKomentar(foto.id, komentarDiv);

    const form = div.querySelector('form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const isi_komentar = form.isi_komentar.value;
      await fetch('/api/komentar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo_id: foto.id, isi_komentar })
      });
      form.reset();
      muatKomentar(foto.id, komentarDiv);
    });
  });
}

async function muatKomentar(photoId, elemenKomentar) {
  const response = await fetch(`/api/komentar/${photoId}`);
  const data = await response.json();
  elemenKomentar.innerHTML = data.map(k => `<p>💬 ${k.isi_komentar}</p>`).join('');
}

ambilFoto();
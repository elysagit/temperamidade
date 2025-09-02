const tempEl = document.getElementById('temp');
const humEl = document.getElementById('hum');
const tsEl = document.getElementById('ts');
const statusEl = document.getElementById('status');
const refreshBtn = document.getElementById('refresh');

async function fetchLatest(){
  try{
    const res = await fetch('/api/latest', {cache: 'no-store'});
    if(!res.ok) throw new Error('Erro na requisição');
    const data = await res.json();
    if (data && data.temperature !== null) {
      tempEl.textContent = `${data.temperature.toFixed(1)} °C`;
      humEl.textContent = `${data.humidity.toFixed(1)} %`;
      tsEl.textContent = `Última leitura: ${new Date(data.timestamp).toLocaleString()}`;
      statusEl.textContent = 'Conectado';
    } else {
      tempEl.textContent = `-- °C`;
      humEl.textContent = `-- %`;
      tsEl.textContent = 'Última leitura: --';
      statusEl.textContent = 'Aguardando primeira leitura...';
    }
  } catch (err) {
    statusEl.textContent = 'Erro ao buscar dados';
    console.error(err);
  }
}

refreshBtn.addEventListener('click', fetchLatest);

fetchLatest();
setInterval(fetchLatest, 5000);
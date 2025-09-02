const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'readings.json');
let latest = {
  temperature: null,
  humidity: null,
  timestamp: null
};

try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE);
    latest = JSON.parse(raw);
  }
} catch (e) {
  console.warn('No persisted data yet.');
}

app.post('/api/readings', (req, res) => {
  const { temperature, humidity, timestamp } = req.body;
  if (typeof temperature !== 'number' || typeof humidity !== 'number') {
    return res.status(400).json({ error: 'temperature and humidity must be numbers' });
  }
  latest = {
    temperature,
    humidity,
    timestamp: timestamp || new Date().toISOString()
  };

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(latest, null, 2));
  } catch (err) {
    console.error('Failed to persist data:', err);
  }
  return res.json({ ok: true, latest });
});

app.get('/api/latest', (req, res) => {
  res.json(latest);
});

app.get('/healthz', (req, res) => res.send('OK'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
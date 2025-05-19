import express from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Бо в ESM немає __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ініціалізація Express app
const app = express();

// Middleware для парсингу JSON
app.use(cors());
app.use(express.json());

// Статичні файли з Vue білду
app.use(express.static(path.join(__dirname, 'dist')));

// API-проксі для запитів на бекенд
app.post('/api/subscribe', async (req, res) => {
  try {
    console.log('Forwarding subscription request:', req.body);

    const response = await axios.post(
      'https://weather-api-production-4236.up.railway.app/api/subscribe',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Received response from backend:', response.status);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error forwarding request to backend:', error);

    if (error.response) {
      console.error('Backend error details:', error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      console.error('No response received from backend');
      res.status(502).json({ error: 'Bad Gateway - No response from backend service' });
    } else {
      res.status(500).json({ error: 'Internal Server Error - Could not process request' });
    }
  }
});

// Всі інші роутинги ведуть на index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
app.use(express.static(path.join(__dirname, 'dist')));
// Старт сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

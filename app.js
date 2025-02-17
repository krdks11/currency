const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.set('view engine', 'ejs');

// API Key
const API_KEY = process.env.API_KEY;
const API_URL = 'https://api.freecurrencyapi.com/v1';

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/currencies', async (req, res) => {
    try {
        const response = await axios.get(`${API_URL}/currencies`, {
            headers: {
                'apikey': API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch currencies' });
    }
});

app.post('/convert', async (req, res) => {
    const { from, to, amount } = req.body;
    try {
        const response = await axios.get(`${API_URL}/latest`, {
            headers: {
                'apikey': API_KEY
            },
            params: {
                base_currency: from,
                currencies: to
            }
        });
        const rate = response.data.data[to];
        const result = amount * rate;
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to convert currency' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 
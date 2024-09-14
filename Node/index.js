const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');
require('dotenv').config();
const app = express();
const corsOptions = {
    origin: process.env.ORIGIN, // Solo permite este dominio
    methods: 'GET',          
    allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions));

const port = 3000;
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

app.post('/generate-image', async (req, res) => {
    const { prompt , size} = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'El prompt es requerido' });
    } 
    if (!size||!['256x256', '512x512', '1024x1024'].includes(size)) {
        return res.status(400).json({ error: 'El tamaño es requerido' });
    }

    try {
        const response = await openai.images.generate({
            prompt: prompt,
            n: 1,
            size: size,
        });
        const imageUrl = response.data[0]?.url || 'URL no disponible';
        res.json({ imageUrl });
    } catch (error) {
        console.error('Error generando la imagen:', error);
        res.status(500).json({ error: 'Error generando la imagen' });
    }
});

app.get('/', (req, res) => {
    res.send('API de generación de imágenes está funcionando');
});

app.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}`);
});

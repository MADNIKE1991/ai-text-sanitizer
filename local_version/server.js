const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static('public'));

app.post('/sanitize', (req, res) => {
    let { text } = req.body;

    if (!text) return res.status(400).send({ error: 'Пустой текст' });

    // Бронебойная регулярка:
    let cleanText = text
        // Захватываем: цифровое тире, короткое, длинное, горизонтальную линию и знак минуса
        .replace(/[\u2012\u2013\u2014\u2015\u2212]/g, '-')
        // Кавычки-елочки
        .replace(/[«»]/g, '"')
        // "Умные" английские кавычки и лапки
        .replace(/[“”„]/g, '"');

    res.send({ cleanText });
});

app.listen(PORT, () => {
    console.log(`⚡ MADNIKE Sanitizer успешно запущен на http://localhost:${PORT}`);
});
const rawInput = document.getElementById('rawText');
const resultOutput = document.getElementById('resultText');
const copyBtn = document.getElementById('copyBtn');

// Функция "Тотальная зачистка" только для текстовых узлов (сохраняет HTML-теги)
function sanitizeNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        node.nodeValue = node.nodeValue
            // 1. Все виды длинных и средних тире -> обычный дефис-минус (-)
            .replace(/[\u2012\u2013\u2014\u2015\u2212]/g, '-')

            // 2. Кавычки-елочки (« ») и немецкие лапки („) -> обычные кавычки (")
            .replace(/[«»„]/g, '"')

            // 3. "Умные" английские кавычки (Open/Close) -> обычные кавычки (")
            .replace(/[“”]/g, '"')

            // 4. Настоящее многоточие (один символ) -> три обычные точки (...)
            .replace(/…/g, '...')

            // 5. Двойные пробелы -> один пробел (только между словами)
            .replace(/(?<=\S) {2,}/g, ' ');
    } else {
        // Рекурсивно проходим по всем дочерним элементам
        for (let child of node.childNodes) {
            sanitizeNode(child);
        }
    }
}

// Обработка ввода
rawInput.addEventListener('input', () => {
    // Проверка на пустоту (с учетом того, что браузер может оставлять пустые теги <br>)
    if (!rawInput.innerText.trim()) {
        rawInput.innerHTML = '';
        resultOutput.innerHTML = '';
        copyBtn.classList.add('hidden');
        return;
    }

    // Клонируем структуру из левого окна в правое
    resultOutput.innerHTML = rawInput.innerHTML;

    // Запускаем очистку текстового контента внутри правого окна
    sanitizeNode(resultOutput);

    if (resultOutput.innerText.trim()) {
        copyBtn.classList.remove('hidden');
    }
});

// Кнопка копирования с поддержкой Rich Text (форматирования)
copyBtn.addEventListener('click', async () => {
    try {
        const htmlContent = resultOutput.innerHTML;
        const textContent = resultOutput.innerText;

        // Создаем специальный контейнер данных для буфера обмена
        const blobHtml = new Blob([htmlContent], { type: 'text/html' });
        const blobText = new Blob([textContent], { type: 'text/plain' });

        const data = [new ClipboardItem({
            'text/html': blobHtml,
            'text/plain': blobText
        })];

        // Записываем данные в буфер обмена
        await navigator.clipboard.write(data);

        // Анимация кнопки
        const originalText = copyBtn.innerText;
        copyBtn.innerText = 'СКОПИРОВАНО!';
        copyBtn.style.backgroundColor = '#0891b2';

        setTimeout(() => {
            copyBtn.innerText = originalText;
            copyBtn.style.backgroundColor = '#059669';
        }, 1500);

    } catch (err) {
        console.error('Не удалось скопировать текст: ', err);
    }
});
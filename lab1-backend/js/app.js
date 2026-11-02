const express = require('express');
const app = express();
const port = 3000;

// Консольное логирование каждого запроса (для продвинутого уровня)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 1. Текстовый эндпоинт
app.get('/', (req, res) => {
    res.send('Добро пожаловать на базовый сервер! (Вариант 7)');
});

// 2. Простой JSON-эндпоинт 1 (Коллекция Студенты)
app.get('/api/students', (req, res) => {
    res.json({
        students: [
            { id: 1, name: "Иван Иванов" },
            { id: 2, name: "Петр Петров" }
        ],
        status: "success"
    });
});

// 3. Простой JSON-эндпоинт 2 (Коллекция Курсы)
app.get('/api/courses', (req, res) => {
    res.json({
        courses: [
            { id: 101, title: "Математика" },
            { id: 102, title: "Программирование" }
        ],
        status: "success"
    });
});

// 4. JSON-эндпоинт с параметром в пути (ID студента)
app.get('/api/students/:id', (req, res) => {
    res.json({
        requestedId: req.params.id,
        status: "success"
    });
});

// Обработка 404 (для среднего и продвинутого уровня)
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
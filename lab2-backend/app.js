const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

// 1. Логирование в файл (Продвинутый уровень)
app.use((req, res, next) => {
    const logLine = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;
    fs.appendFileSync('access.log', logLine);
    console.log(logLine.trim());
    next();
});

// ============= ХРАНИЛИЩЕ ДАННЫХ (Вариант 12: Игры) =============
let games = [
    { id: 1, title: 'The Witcher 3', genre: 'RPG', platform: 'PC', rating: 9.8 },
    { id: 2, title: 'God of War', genre: 'Action', platform: 'PS5', rating: 9.5 },
    { id: 3, title: 'Cyberpunk 2077', genre: 'RPG', platform: 'PC', rating: 8.5 },
    { id: 4, title: 'Spider-Man 2', genre: 'Action', platform: 'PS5', rating: 9.0 }
];
let nextId = 5;

// ============= CRUD =============

// GET все игры (с поиском и сортировкой)
app.get('/games', (req, res) => {
    let result = [...games];
    
    // Поиск по названию (search)
    if (req.query.search) {
        result = result.filter(g => g.title.toLowerCase().includes(req.query.search.toLowerCase()));
    }
    
    // Сортировка (sort & order)
    if (req.query.sort) {
        const order = req.query.order === 'desc' ? -1 : 1;
        result.sort((a, b) => (a[req.query.sort] > b[req.query.sort] ? 1 : -1) * order);
    }
    
    res.json({ count: result.length, games: result });
});

// ============= ДОПОЛНИТЕЛЬНЫЕ ФИЧИ (Продвинутый уровень) =============
// ВАЖНО: Они должны быть ДО маршрутов с :id

// Статистика: средний рейтинг
app.get('/games/stats', (req, res) => {
    if (games.length === 0) return res.json({ averageRating: 0 });
    const sum = games.reduce((acc, g) => acc + g.rating, 0);
    res.json({ totalGames: games.length, averageRating: (sum / games.length).toFixed(2) });
});

// Массовое создание (POST /games/bulk)
app.post('/games/bulk', (req, res) => {
    const newGames = req.body;
    if (!Array.isArray(newGames)) return res.status(400).json({ error: 'Ожидается массив' });
    
    const created = newGames.map(g => ({ id: nextId++, ...g }));
    games.push(...created);
    res.status(201).json(created);
});

// Массовое удаление (DELETE /games)
app.delete('/games', (req, res) => {
    games = [];
    res.status(204).send();
});


// ============= МАРШРУТЫ С ПАРАМЕТРАМИ (Должны быть ниже) =============

// GET одна игра
app.get('/games/:id', (req, res) => {
    const game = games.find(g => g.id === parseInt(req.params.id));
    if (!game) return res.status(404).json({ error: 'Игра не найдена' });
    res.json(game);
});

// Связанные игры (по платформе)
app.get('/games/:id/related', (req, res) => {
    const game = games.find(g => g.id === parseInt(req.params.id));
    if (!game) return res.status(404).json({ error: 'Игра не найдена' });
    
    const related = games.filter(g => g.platform === game.platform && g.id !== game.id);
    res.json({ platform: game.platform, related });
});

// POST создание
app.post('/games', (req, res) => {
    const { title, genre, platform, rating } = req.body;
    if (!title || !genre) return res.status(400).json({ error: 'Поля title и genre обязательны' });
    
    const newGame = { id: nextId++, title, genre, platform: platform || 'PC', rating: rating || 0 };
    games.push(newGame);
    res.status(201).json(newGame);
});

// PUT полное обновление
app.put('/games/:id', (req, res) => {
    const index = games.findIndex(g => g.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Игра не найдена' });
    
    const { title, genre, platform, rating } = req.body;
    games[index] = { id: parseInt(req.params.id), title, genre, platform, rating };
    res.json(games[index]);
});

// PATCH частичное обновление (Продвинутый уровень)
app.patch('/games/:id', (req, res) => {
    const index = games.findIndex(g => g.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Игра не найдена' });
    
    games[index] = { ...games[index], ...req.body };
    res.json(games[index]);
});

// DELETE удаление
app.delete('/games/:id', (req, res) => {
    const index = games.findIndex(g => g.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Игра не найдена' });
    
    const deleted = games.splice(index, 1)[0];
    res.status(204).send(); // 204 No Content
});

// ============= ОБРАБОТКА ОШИБОК =============

// Глобальная обработка 404
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// Глобальная обработка 500
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
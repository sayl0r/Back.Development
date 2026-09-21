from flask import Flask, jsonify, request
import time

app = Flask(__name__)

# --- Реализация простого консольного логирования ---
@app.before_request
def log_request():
    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {request.method} {request.path}")

# --- 1. Текстовый эндпоинт ---
@app.route('/')
def home():
    return 'Добро пожаловать на базовый сервер! (Вариант 7)'

# --- 2. Простой JSON-эндпоинт 1 ---
@app.route('/api/students')
def get_students():
    return jsonify({
        "students": [
            {"id": 1, "name": "Иван Иванов"},
            {"id": 2, "name": "Петр Петров"}
        ],
        "status": "success"
    })

# --- 3. Простой JSON-эндпоинт 2 ---
@app.route('/api/courses')
def get_courses():
    return jsonify({
        "courses": [
            {"id": 101, "title": "Математика"},
            {"id": 102, "title": "Программирование"}
        ],
        "status": "success"
    })

# --- 4. JSON-эндпоинт с параметром в пути ---
@app.route('/api/students/<int:student_id>')
def get_student_by_id(student_id):
    return jsonify({
        "requestedId": student_id,
        "status": "success"
    })

# --- 5. Обработчик 404 ---
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Маршрут не найден"}), 404

if __name__ == '__main__':
    app.run(port=3000, debug=True)
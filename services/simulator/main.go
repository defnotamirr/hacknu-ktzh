package main

import (
	"log"
	"net/http"
)

func main() {
	// 1. Наш основной маршрут для потока данных
	http.HandleFunc("/ws", HandleWebSocket)

	// 2. МАРШРУТ ДЛЯ ПОЧИНКИ (Магическая кнопка)
	http.HandleFunc("/fix", func(w http.ResponseWriter, r *http.Request) {
		// Вызываем метод починки
		SharedLoco.Fix()

		// Разрешаем фронтенду делать запросы с любого порта (CORS)
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Content-Type", "application/json")

		// Отвечаем фронтенду, что всё ок
		w.Write([]byte(`{"status": "success", "message": "Train is repaired!"}`))
		log.Println("🛠 Кнопка ПОЧИНИТЬ нажата! Поезд восстановлен.")
	})

	log.Println("🚀 Симулятор запущен! Ожидание подключений на ws://localhost:8080/ws")
	log.Println("💡 Для починки отправьте GET-запрос на http://localhost:8080/fix")

	// Запускаем сервер
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("Ошибка запуска сервера: ", err)
	}
}

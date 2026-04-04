package main

import (
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/ws", HandleWebSocket)

	http.HandleFunc("/fix", func(w http.ResponseWriter, r *http.Request) {
		SharedLoco.Fix()

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Content-Type", "application/json")

		w.Write([]byte(`{"status": "success", "message": "Train is repaired"}`))
		log.Println("Train is repaired.")
	})

	log.Println("🚀 Симулятор запущен! Ожидание подключений на ws://localhost:8080/ws")
	log.Println("💡 Для починки отправьте GET-запрос на http://localhost:8080/fix")

	err := http.ListenAndServe(":8081", nil)
	if err != nil {
		log.Fatal("Ошибка запуска сервера: ", err)
	}
}

package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

func streamToIngestion(ingestionURL string) {
	for {
		var conn *websocket.Conn
		var err error

		for {
			log.Printf("Trying to connect Ingestion: %s...", ingestionURL)
			conn, _, err = websocket.DefaultDialer.Dial(ingestionURL, nil)
			if err == nil {
				break
			}
			log.Println("Ingestion disconnected:", err, "- retrying in 2s")
			time.Sleep(2 * time.Second)
		}

		log.Println("Connected to Ingestion")

		ticker := time.NewTicker(500 * time.Millisecond)

		for range ticker.C {
			data := SharedLoco.Next()
			err = conn.WriteJSON(data)
			if err != nil {
				log.Println("Disconnected: ", err)
				ticker.Stop()
				conn.Close()
				break
			}
		}
	}
}
func main() {
	ingestionURL := "ws://ingestion:8081/ws"
	go streamToIngestion(ingestionURL)

	// 2. МАРШРУТ ДЛЯ ПОЧИНКИ (Трогать нельзя, фронтенд ждет его тут)
	http.HandleFunc("/fix", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		SharedLoco.Fix()
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status": "success", "message": "Train is repaired!"}`))
		log.Println("Train is repaired!")
	})

	log.Println("Simulator is running.")

	// 3. Запускаем сервер для кнопки /fix
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("Ошибка запуска сервера: ", err)
	}
}

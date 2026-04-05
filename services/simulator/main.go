package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync/atomic"
	"time"

	"github.com/gorilla/websocket"
)

var delayMs atomic.Int64

func init() {
	delayMs.Store(500)
}

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

		for {
			data := SharedLoco.Next()
			err = conn.WriteJSON(data)
			if err != nil {
				log.Println("Disconnected: ", err)
				conn.Close()
				break
			}

			currentDelay := time.Duration(delayMs.Load()) * time.Millisecond
			time.Sleep(currentDelay)
		}
	}
}

func main() {
	ingestionURL := "ws://ingestion:8081/ws"
	go streamToIngestion(ingestionURL)

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

	http.HandleFunc("/highload", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		var reqBody struct {
			Enable bool `json:"enable"`
		}

		if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		if reqBody.Enable {
			delayMs.Store(50)
			log.Println("⚡ Highload Mode: ON (10x speed)")
		} else {
			delayMs.Store(500)
			log.Println("🐢 Highload Mode: OFF (Normal speed)")
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status": "success"}`))
	})

	log.Println("Simulator is running on :8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("Ошибка запуска сервера: ", err)
	}
}

package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Connection Error:", err)
		return
	}
	defer ws.Close()

	log.Println("Client successfully connected")

	loco := SharedLoco
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	// Начинаем слать данные
	for range ticker.C {
		data := loco.Next()

		err := ws.WriteJSON(data)
		if err != nil {
			log.Println("Client disconnected.")
			break
		}
	}
}

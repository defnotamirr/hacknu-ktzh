package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

// Настройки апгрейдера для веб-сокетов
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Разрешаем подключения откуда угодно
	},
}

// HandleWebSocket — отдельная функция, которая управляет подключением
func HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Ошибка соединения:", err)
		return
	}
	defer ws.Close()

	log.Println("✅ Подключился новый клиент!")

	// Создаем локомотив для этого подключения
	loco := SharedLoco
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	// Начинаем слать данные
	for range ticker.C {
		data := loco.Next()

		err := ws.WriteJSON(data)
		if err != nil {
			log.Println("❌ Клиент отключился")
			break
		}
	}
}

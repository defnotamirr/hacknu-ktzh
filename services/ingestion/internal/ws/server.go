package ws

import(
	"log"
	"net/http"
	"encoding/json"

	"github.com/gorilla/websocket"

	"github.com/xyn3x/hacknu-ktzh/services/ingestion/internal/model"
	"github.com/xyn3x/hacknu-ktzh/services/ingestion/internal/pipeline"
	"github.com/xyn3x/hacknu-ktzh/services/ingestion/internal/validator"
)


var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

type Server struct {
	fwd *pipeline.Forwarder
}

func NewServer(fwd *pipeline.Forwarder) *Server {
	return &Server{fwd: fwd}
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket Upgrade Error: ", err)
		return 
	}
	defer conn.Close()
	log.Println("Client Connected: ", r.RemoteAddr)

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("Client Disconnected: ", r.RemoteAddr)
			return 
		}

		var t model.Telemetry

		err := json.Unmarshal(msg, &t)
		if err != nil {
			s.reply(conn, "Invalid JSON")
			continue
		}

		err := validator.Validate(&t)
		if err != nil {
			log.Printf("Rejected: %v", err)
			s.reply(conn, err.Error())
			continue
		}
		
		err := s.fwd.Forward(&t)
		if err != nil {
			log.Printf("Forward Error: %v", err)
			s.reply(conn, err.Error())
			continue
		}

		conn.WriteMessage(websocket.TextMessage, []byte({`{"ok":true}`}))
	}
}

func (s *Server) reply(conn *websocket.Conn, errMessage string) {
	data, _ := json.Marshal(map[string]string{"error":errMessage})
	conn.WriteMessage(websocket.TextMessage, data)
}

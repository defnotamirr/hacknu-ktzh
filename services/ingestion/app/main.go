package main 

import(
	"log"
	"net/http"
	"os"
	"strings"
	
	"github.com/xyn3x/hacknu-ktzh/services/ingestion/internal/pipeline"
	"github.com/xyn3x/hacknu-ktzh/services/ingestion/internal/ws"
)

func main() {
	brokers := strings.Split(env("REDPANDA_BROKERS", "redpanda:29092"), ",")

	port := env("INGESTION_PORT", "8081")

	forward := pipeline.NewForwarder(brokers)
	defer forward.Close()
	log.Println("Conntected to Redpanda: ", brokers)
	
	server := ws.NewServer(forward)

	http.Handle("/ws", server)
	http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request){
		w.Write([]byte("ok"))
	})

	log.Println("Listening on: " + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func env(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
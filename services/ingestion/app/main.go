package main 

import(
	"log"
	"net/http"
	"os"

	"github.com/nats-io/nats.go"
	"github.com/xyn3x/hacknu-ktzh/services/ingestion/internal/pipeline"
	"github.com/xyn3x/hacknu-ktzh/services/ingestion/internal/ws"
)

func main() {
	natsUrl = os.Getenv("NATS_URL")
	if natsUrl == "" {
		natsUrl = nats.DefaultURL
	}

	nc, err := nats.Connect(natsUrl)
	if err != nil {
		log.Fatal("NATS connection failed: ", err)
	}
	defer nc.Close()
	log.Println("NATS connected successfully: ", natsUrl)

	forward := pipeline.NewForwarder(nc)
	server := ws.NewServer(forward)

	http.Handle("/ingest/ws", server)
	http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request){
		w.Write([]byte("ok"))
	})

	port := os.Getenv("INGESTION_PORT")
	if port == "" {
		port = "8081"
	}
	log.Prinln("Listening on: " + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
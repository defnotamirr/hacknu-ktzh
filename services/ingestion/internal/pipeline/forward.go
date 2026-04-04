package pipeline

import(
	"fmt"
	"encoding/json"

	"github.com/nats-io/nats.go"

	"github.com/xyn3x/hacknu-ktzh/services/ingestion/internal/model"
)

const Subject = "telemetry.frame"

type Forwarder struct {
	nc *nats.Conn 
}

func NewForwarder(nc *nats.Conn) *Forwarder {
	return &Forwarder{nc: nc}
}

func (f *Forwarder) Forward(t *model.Telemetry) error {
	data, err := json.Marshal(t)
	if err != nil {
		return fmt.Errorf("Error with fetching json (Marshal): %w", err)
	}
	return f.nc.Publish(Subject, data)
}

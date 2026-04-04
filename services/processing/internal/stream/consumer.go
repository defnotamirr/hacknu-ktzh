package stream 

import(
	"encoding/json"
	"log"

	"github.com/segmentio/kafka-go"
 
	"github.com/xyn3x/hacknu-ktzh/services/processing/internal/alerts"
	"github.com/xyn3x/hacknu-ktzh/services/processing/internal/health"
	"github.com/xyn3x/hacknu-ktzh/services/processing/internal/model"
	"github.com/xyn3x/hacknu-ktzh/services/processing/internal/smoothing"
	"github.com/xyn3x/hacknu-ktzh/services/processing/internal/storage"
)


type Consumer struct {
	reader 		*kafka.Reader 
	writer 		*kafka.Writer 
	db 			*storage.DB
	smoother 	*smoothing.Smoother
}

func NewConsumer(brokers []string, db *storage.DB) *Consumer {
	return &Consumer{
		reader: kafka.NewReader(kafka.ReaderConfig{
			Brokers: 	brokers,
			Topic: 		"telemetry.frame", 
			GroupID: 	"processing",
			MinBytes: 	1,
			MaxBytes: 	10e6,
		}),
		writer: &kafka.Writer{
			Addr: 					kafka.TCP(brokers...),
			Topic: 					"telemetry.processed",
			Balancer: 				&kafka.LeastBytes{},
			AllowAutoTopicCreation: true,
		}, 
		db: db, 
		smoother: smoothing.NewSmoother(0.3),
	}
}

func (c *Consumer) Start(ctx context.Context) {
	log.Println("[consumer] reading from telemetry.frame")
	for {
		message, err := c.reader.ReadMessage(ctx)
		if err != nil {
			if ctx.Err() != nil {
				return 
			}
			log.Println("[consumer] reading error: ", err)
			continue 
		}
		c.process(ctx, message.Value)
	}
}

func (c *Consumer) process(ctx context.Context, data []byte) {
	var t model.Telemetry
	err := json.Unmarshal(data, &t)
	if err != nil {
		log.Println("[consumer] json failed: ", err)
		return 
	}

	smoothed := &model.Telemetry {
		Timestamp: t.Timestamp,
		Speed:     c.smoother.Speed.Update(t.Speed),
		Temp:      c.smoother.Temp.Update(t.Temp),
		Pressure:  c.smoother.Pressure.Update(t.Pressure),
		Fuel:      c.smoother.Fuel.Update(t.Fuel),
		Voltage:   c.smoother.Voltage.Update(t.Voltage),
		Error:     t.Error,
	}

	h := health.Compute(
		smoothed.Speed, smoothed.Temp, smoothed.Pressure,
		smoothed.Fuel, smoothed.Voltage, smoothed.Error,
	)

	al := alerts.Check(smoothed)

	frame := &model.ProcessedFrame{
		Telemetry: *smoothed,
		Health:    h,
		Alerts:    al,
	}

	err = c.db.Save(frame)
	if err != nil {
		log.Println("[consumer] can't save in db: ", err)
		return 
	}

	out, _ := json.Marshal(frame)
	err = c.writer.WriteMessage(ctx, kafka.Message{Value: out})
	if err != nil {
		log.Println("[consumer] publish processed error:", err)
	}
}

func (c *Consumer) Close() {
	c.reader.Close()
	c.writer.Close()
}
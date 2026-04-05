package stream 

import(
	"encoding/json"
	"log"
	"context"
	"math"

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
	prev 		*model.Telemetry
}

var spikeLimits = struct {
	Speed    float64 // км/ч за тик
	Temp     float64 // °C за тик
	Pressure float64 // бар за тик
	Fuel     float64 // % за тик
	Voltage  float64 // В за тик
}{
	Speed:    20,  // поезд не может разогнаться/затормозить на 20 км/ч за секунду
	Temp:     10,  // двигатель не нагревается на 10C за секунду в норме
	Pressure: 2,   // давление не падает на 2 бар за секунду в норме
	Fuel:     2,   // топливо не уходит на 2% за секунду
	Voltage:  200, // напряжение не прыгает на 200В за секунду
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

	spikeDetected := false
	if c.prev != nil {
		if math.Abs(t.Speed-c.prev.Speed)       > spikeLimits.Speed    ||
			math.Abs(t.Temp-c.prev.Temp)         > spikeLimits.Temp     ||
			math.Abs(t.Pressure-c.prev.Pressure) > spikeLimits.Pressure ||
			math.Abs(t.Fuel-c.prev.Fuel)         > spikeLimits.Fuel     ||
			math.Abs(t.Voltage-c.prev.Voltage)   > spikeLimits.Voltage  {
			spikeDetected = true
			log.Printf("[consumer] spike detected: speed Δ%.1f temp Δ%.1f pressure Δ%.2f fuel Δ%.1f voltage Δ%.0f",
				math.Abs(t.Speed-c.prev.Speed),
				math.Abs(t.Temp-c.prev.Temp),
				math.Abs(t.Pressure-c.prev.Pressure),
				math.Abs(t.Fuel-c.prev.Fuel),
				math.Abs(t.Voltage-c.prev.Voltage),
			)
		}
	}
	c.prev = &t

	hasError := t.Error || spikeDetected
	smoothed := model.Telemetry {
		Timestamp: t.Timestamp,
		Speed:     c.smoother.Speed.Update(t.Speed),
		Temp:      c.smoother.Temp.Update(t.Temp),
		Pressure:  c.smoother.Pressure.Update(t.Pressure),
		Fuel:      c.smoother.Fuel.Update(t.Fuel),
		Voltage:   c.smoother.Voltage.Update(t.Voltage),
		Error:     hasError,
	}

	h := health.Compute(
		smoothed.Speed, smoothed.Temp, smoothed.Pressure,
		smoothed.Fuel, smoothed.Voltage, smoothed.Error,
	)

	al := alerts.Check(&smoothed)

	frame := model.ProcessedFrame{
		Telemetry: smoothed,
		Health:    h,
		Alerts:    al,
	}

	err = c.db.Save(&frame)
	if err != nil {
		log.Println("[consumer] can't save in db: ", err)
		return 
	}

	out, _ := json.Marshal(frame)
	err = c.writer.WriteMessages(ctx, kafka.Message{Value: out})
	if err != nil {
		log.Println("[consumer] publish processed error:", err)
	}
}

func (c *Consumer) Close() {
	c.reader.Close()
	c.writer.Close()
}
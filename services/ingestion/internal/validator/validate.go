package validator

import(
	"fmt"

	"github.com/xyn3x/hacknu-ktzh/services/ingestion/internal/model"
)

func Validate(t *model.Telemetry) error {
	if t.Timestamp <= 0 {
		return fmt.Errorf("timestamp is required")
	}
	if t.Speed < 0 || t.Speed > 300 {
		return fmt.Errorf("speed out of range: %.1f", t.Speed)
	}
	if t.Temp < -60 || t.Temp > 200 {
		return fmt.Errorf("temp out of range: %.1f", t.Temp)
	}
	if t.Pressure < 0 || t.Pressure > 20 {
		return fmt.Errorf("pressure out of range: %.1f", t.Pressure)
	}
	if t.Fuel < 0 || t.Fuel > 100 {
		return fmt.Errorf("fuel out of range: %.1f", t.Fuel)
	}
	if t.Voltage < 0 || t.Voltage > 3000 {
		return fmt.Errorf("voltage out of range: %.1f", t.Voltage)
	}
	return nil
}
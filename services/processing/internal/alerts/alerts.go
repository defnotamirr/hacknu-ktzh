package alerts

import "github.com/xyn3x/hacknu-ktzh/services/processing/internal/model"

func Check(t *model.Telemetry) []string {
	var result []string

	if t.Temp > 105 {
		result = append(result, "CRITICAL: Engine temperature too high")
	} else if t.Temp > 90 {
		result = append(result, "WARNING: Engine temperature elevated")
	}

	if t.Pressure > 8 {
		result = append(result, "CRITICAL: Pressure exceeds maximum limit")
	} else if t.Pressure < 3 {
		result = append(result, "CRITICAL: Pressure critically low")
	} else if t.Pressure < 4.5 {
		result = append(result, "WARNING: Pressure below normal")
	}

	if t.Fuel < 100 {
		result = append(result, "CRITICAL: Fuel level critically low")
	} else if t.Fuel < 1000 {
		result = append(result, "WARNING: Fuel level low")
	}

	if t.Voltage > 150 {
		result = append(result, "CRITICAL: Voltage surge detected")
	} else if t.Voltage < 40 {
		result = append(result, "CRITICAL: Voltage critically low")
	} else if t.Voltage < 65 {
		result = append(result, "WARNING: Voltage below normal")
	}

	if t.Speed > 140 {
		result = append(result, "WARNING: Speed exceeds recommended limit")
	}

	if t.Error {
		result = append(result, "ERROR: Locomotive reported a fault code")
	}

	return result
}

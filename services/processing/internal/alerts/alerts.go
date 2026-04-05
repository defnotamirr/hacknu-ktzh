package alerts

import "github.com/xyn3x/hacknu-ktzh/services/processing/internal/model"

func Check(t *model.Telemetry) []string {
	var result []string

	if t.Temp > 120 {
		result = append(result, "CRITICAL: Engine temperature too high")
	} else if t.Temp > 100 {
		result = append(result, "WARNING: Engine temperature elevated")
	}

	if t.Pressure < 6 {
		result = append(result, "CRITICAL: Pressure critically low")
	} else if t.Pressure < 7 {
		result = append(result, "WARNING: Pressure below normal")
	}

	if t.Fuel < 10 {
		result = append(result, "CRITICAL: Fuel level critically low")
	} else if t.Fuel < 20 {
		result = append(result, "WARNING: Fuel level low")
	}

	if t.Voltage < 1250 {
		result = append(result, "CRITICAL: Voltage critically low")
	} else if t.Voltage < 1350 {
		result = append(result, "WARNING: Voltage below normal")
	}

	if t.Speed > 160 {
		result = append(result, "WARNING: Speed exceeds recommended limit")
	}

	if t.Error {
		result = append(result, "ERROR: Locomotive reported a fault code")
	}

	return result
}
package health
 
import "math"

func Compute(speed, temp, pressure, fuel, voltage float64, hasError bool) float64 {
	tempScore     := scoreDescending(temp,     60, 90, 130)   // nominal ≤90°C, critical ≥130°C
	pressureScore := scoreDescending(pressure,  5,  8,   5)   // nominal ≥8 bar, critical ≤5 bar
	voltageScore  := scoreAscending(voltage,  1200, 1500, 1800) // nominal 1500V
	fuelScore     := scoreAscending(fuel,        0,  20,  100) // below 20% is concern
	speedScore    := scoreDescending(speed,       0,  120, 200) // over 120 starts penalising
 
	health := 0.30*tempScore +
		0.25*pressureScore +
		0.20*voltageScore +
		0.15*fuelScore +
		0.10*speedScore
 
	// Error flag knocks off 20 points
	if hasError {
		health -= 20
	}
 
	return math.Round(math.Max(0, math.Min(100, health)))
}
 
// scoreDescending: full score when val ≤ nominal, zero score when val ≥ critical (high = bad)
func scoreDescending(val, min, nominal, critical float64) float64 {
	if val <= nominal {
		return 100
	}
	if val >= critical {
		return 0
	}
	return 100 * (critical - val) / (critical - nominal)
}
 
// scoreAscending: full score when val ≥ nominal, zero when val ≤ min (low = bad)
func scoreAscending(val, min, nominal, max float64) float64 {
	if val >= nominal {
		return 100
	}
	if val <= min {
		return 0
	}
	return 100 * (val - min) / (nominal - min)
}
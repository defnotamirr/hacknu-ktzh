package health

import "math"

func Compute(speed, temp, pressure, fuel, voltage float64, hasError bool) float64 {
	tempScore := scoreDescending(temp, -30, 90, 105)
	pressureScore := scoreTwoSided(pressure, 2, 5, 8)
	voltageScore := scoreTwoSided(voltage, 40, 75, 150)
	fuelScore := scoreAscending(fuel, 500, 1000, 5000)
	speedScore := scoreDescending(speed, 0, 100, 180)

	health := 0.35*tempScore +
		0.35*pressureScore +
		0.20*voltageScore +
		0.05*fuelScore +
		0.5*speedScore

	return math.Round(math.Max(0, math.Min(100, health)))
}

// scoreTwoSided: full score when val == nominal, zero score when val ≤ minCrit or val ≥ maxCrit (out of bounds = bad)
func scoreTwoSided(val, minCrit, nominal, maxCrit float64) float64 {
	if val <= minCrit || val >= maxCrit {
		return 0
	}
	if val < nominal {
		return 100 * (val - minCrit) / (nominal - minCrit)
	}
	return 100 * (maxCrit - val) / (maxCrit - nominal)
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

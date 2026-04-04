package smoothing

// EMA applies exponential moving average to a stream of values.
// alpha=0.2 means slow smoothing (less noise); alpha=0.8 means fast response.
type EMA struct {
	alpha float64
	value float64
	ready bool
}

func NewEMA(alpha float64) *EMA {
	return &EMA{alpha: alpha}
}

func (e *EMA) Update(v float64) float64 {
	if !e.ready {
		e.value = v
		e.ready = true
	} else {
		e.value = e.alpha*v + (1-e.alpha)*e.value
	}
	return e.value
}

func (e *EMA) Value() float64 { return e.value }

type Smoother struct {
	Speed    *EMA
	Temp     *EMA
	Pressure *EMA
	Fuel     *EMA
	Voltage  *EMA
}

func NewSmoother(alpha float64) *Smoother {
	return &Smoother{
		Speed:    NewEMA(alpha),
		Temp:     NewEMA(alpha),
		Pressure: NewEMA(alpha),
		Fuel:     NewEMA(alpha),
		Voltage:  NewEMA(alpha),
	}
}
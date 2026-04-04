package model

type ProcessedFrame struct {
	Timestamp int64    `json:"timestamp"`
	Speed     float64  `json:"speed"`
	Temp      float64  `json:"temp"`
	Pressure  float64  `json:"pressure"`
	Fuel      float64  `json:"fuel"`
	Voltage   float64  `json:"voltage"`
	Error     bool     `json:"error"`
	Health    float64  `json:"health"`
	Alerts    []string `json:"alerts"`
}
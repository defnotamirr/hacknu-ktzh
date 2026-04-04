package main

import (
	"math/rand"
	"time"
)

type Telemetry struct {
	Timestamp int64   `json:"timestamp"`
	Speed     float64 `json:"speed"`
	Temp      float64 `json:"temp"`
	Pressure  float64 `json:"pressure"`
	Fuel      float64 `json:"fuel"`
	Voltage   float64 `json:"voltage"`
	Error     bool    `json:"error"`
}

type State struct {
	Current       Telemetry
	IsOverheating bool
	IsLeakingFuel bool
	IsLeakingAir  bool
}

func NewState() *State {
	return &State{
		Current: Telemetry{
			Speed:    0.0,
			Temp:     20.0,
			Pressure: 4.0,
			Fuel:     5000.0,
			Voltage:  75.0,
			Error:    false,
		},
		IsOverheating: false,
		IsLeakingFuel: false,
		IsLeakingAir:  false,
	}
}

// ---------------------------------------------------------
// ГЛОБАЛЬНАЯ ПЕРЕМЕННАЯ (Живет на уровне файла)
// ---------------------------------------------------------
var SharedLoco = NewState()

func (s *State) Next() Telemetry {
	s.Current.Timestamp = time.Now().UnixMilli()
	s.Current.Error = false

	// 1. СКОРОСТЬ
	s.Current.Speed += (rand.Float64() - 0.5) * 5.0
	if s.Current.Speed < 0 {
		s.Current.Speed = 0
	}
	if s.Current.Speed > 120 {
		s.Current.Speed = 120
	}

	// 2. ТОПЛИВО
	if s.IsLeakingFuel {
		s.Current.Fuel -= 20.0 + (rand.Float64() * 10.0)
		s.Current.Error = true
	} else {
		s.Current.Fuel -= 0.1 + (s.Current.Speed * 0.01)
	}
	if s.Current.Fuel < 0 {
		s.Current.Fuel = 0
	}

	// 3. ТЕМПЕРАТУРА
	if s.IsOverheating {
		s.Current.Temp += 1.0 + rand.Float64()
		if s.Current.Temp > 120.0 {
			s.Current.Temp = 120.0
		}
		s.Current.Error = true
	} else {
		targetTemp := 20.0 + (s.Current.Speed * 0.8)
		s.Current.Temp += (targetTemp-s.Current.Temp)*0.1 + (rand.Float64() - 0.5)
	}

	// 4. ДАВЛЕНИЕ
	if s.IsLeakingAir {
		s.Current.Pressure -= 0.05 + (rand.Float64() * 0.05)
		if s.Current.Pressure < 0 {
			s.Current.Pressure = 0
		}
		s.Current.Error = true
	} else {
		s.Current.Pressure = 4.0 + (rand.Float64() * 0.5)
	}

	// 5. ВОЛЬТАЖ
	s.Current.Voltage = 74.0 + (rand.Float64() * 2.0)

	// ---------------------------------------------------------
	// 6. ГЕНЕРАТОР ПОЛОМОК И ГЛЮКОВ
	// ---------------------------------------------------------
	chance := rand.Float64()

	if chance < 0.005 && !s.IsOverheating {
		s.IsOverheating = true
	} else if chance >= 0.005 && chance < 0.010 && !s.IsLeakingFuel {
		s.IsLeakingFuel = true
	} else if chance >= 0.010 && chance < 0.015 && !s.IsLeakingAir {
		s.IsLeakingAir = true
	}

	switch {
	case chance >= 0.015 && chance < 0.020:
		s.Current.Speed = -45.5
	case chance >= 0.020 && chance < 0.025:
		s.Current.Temp = 999.9
	case chance >= 0.025 && chance < 0.030:
		s.Current.Pressure = -5.0
	case chance >= 0.030 && chance < 0.035:
		s.Current.Voltage = 0.0
		s.Current.Error = true
	}

	return s.Current
}

// ---------------------------------------------------------
// МЕТОД ПОЧИНКИ (Вынесен как отдельная функция)
// ---------------------------------------------------------
func (s *State) Fix() {
	s.IsOverheating = false
	s.IsLeakingFuel = false
	s.IsLeakingAir = false
	s.Current.Error = false

	s.Current.Temp = 80.0
	s.Current.Pressure = 4.0
	s.Current.Fuel = 5000.0
}

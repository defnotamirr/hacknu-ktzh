package main

import (
	"math/rand"
	"sync"
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
	mu sync.Mutex

	speed    float64
	temp     float64
	pressure float64
	fuel     float64
	voltage  float64

	speedPhase int
	tempPhase  int
	pressPhase int
	fuelPhase  int
	voltPhase  int

	targetSpeed float64
	targetTemp  float64
	targetPress float64
	targetVolt  float64
}

func NewState() *State {
	return &State{
		speed: 0.0, temp: 85.0, pressure: 5.0, fuel: 5000.0, voltage: 75.0,
		speedPhase: 0, targetSpeed: 100.0,
		tempPhase: 0, targetTemp: 85.0,
		pressPhase: 0, targetPress: 5.0,
		fuelPhase: 0,
		voltPhase: 0, targetVolt: 75.0,
	}
}

var SharedLoco = NewState()

func (s *State) Fix() {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.speedPhase = 1
	s.targetSpeed = 100.0

	s.tempPhase = 0
	s.targetTemp = 85.0
	if s.temp > 100 || s.temp < 50 {
		s.temp = 85.0
	}

	s.pressPhase = 0
	s.targetPress = 5.0
	if s.pressure < 3 || s.pressure > 7 {
		s.pressure = 5.0
	}

	s.fuelPhase = 0

	s.voltPhase = 0
	s.targetVolt = 75.0
	if s.voltage < 60 || s.voltage > 90 {
		s.voltage = 75.0
	}
}

func (s *State) Next() Telemetry {
	s.mu.Lock()
	defer s.mu.Unlock()

	switch s.speedPhase {
	case 0:
		s.speed += 0.5 + rand.Float64()
		if s.speed >= 100 {
			s.speedPhase = 1
			s.targetSpeed = 100.0
		}
	case 1:
		s.speed += (s.targetSpeed-s.speed)*0.1 + (rand.Float64()-0.5)*2.0
		if rand.Float64() < 0.05 {
			s.targetSpeed = 80.0 + rand.Float64()*40.0
		}
		if rand.Float64() < 0.005 {
			s.speedPhase = 2
			s.targetSpeed = 180.0
		}
	case 2:
		s.speed += (s.targetSpeed-s.speed)*0.02 + (rand.Float64() - 0.5)
		if s.speed > 175 && rand.Float64() < 0.05 {
			s.speedPhase = 1
			s.targetSpeed = 100.0
		}
	}

	switch s.tempPhase {
	case 0:
		s.temp += (85.0-s.temp)*0.1 + (rand.Float64()-0.5)*2.0
		if rand.Float64() < 0.005 {
			s.tempPhase = 1
			s.targetTemp = 120.0
		}
		if rand.Float64() < 0.005 {
			s.tempPhase = 2
			s.targetTemp = -30.0
		}
	case 1:
		s.temp += (s.targetTemp-s.temp)*0.05 + (rand.Float64() - 0.5)
		if s.temp > 115 && rand.Float64() < 0.02 {
			s.tempPhase = 0
		}
	case 2:
		s.temp += (s.targetTemp-s.temp)*0.05 + (rand.Float64() - 0.5)
		if s.temp < -25 && rand.Float64() < 0.02 {
			s.tempPhase = 0
		}
	}

	switch s.pressPhase {
	case 0:
		s.pressure += (5.0-s.pressure)*0.1 + (rand.Float64()-0.5)*0.2
		if rand.Float64() < 0.005 {
			s.pressPhase = 1
			s.targetPress = 2.0
		}
		if rand.Float64() < 0.005 {
			s.pressPhase = 2
			s.targetPress = 8.0
		}
	case 1:
		s.pressure += (s.targetPress - s.pressure) * 0.05
		if s.pressure < 2.5 && rand.Float64() < 0.02 {
			s.pressPhase = 0
		}
	case 2:
		s.pressure += (s.targetPress - s.pressure) * 0.05
		if s.pressure > 7.5 && rand.Float64() < 0.02 {
			s.pressPhase = 0
		}
	}

	switch s.fuelPhase {
	case 0:
		s.fuel -= 0.5 + rand.Float64()*0.5
		if rand.Float64() < 0.005 {
			s.fuelPhase = 1
		}
	case 1:
		s.fuel -= 5.0 + rand.Float64()*10.0
	}
	if s.fuel < 0 {
		s.fuel = 0
	}

	switch s.voltPhase {
	case 0:
		s.voltage += (75.0-s.voltage)*0.1 + (rand.Float64()-0.5)*2.0
		if rand.Float64() < 0.005 {
			s.voltPhase = 1
			s.targetVolt = 30.0
		}
		if rand.Float64() < 0.005 {
			s.voltPhase = 2
			s.targetVolt = 130.0
		}
	case 1:
		s.voltage += (s.targetVolt - s.voltage) * 0.05
		if s.voltage < 35 && rand.Float64() < 0.02 {
			s.voltPhase = 0
		}
	case 2:
		s.voltage += (s.targetVolt - s.voltage) * 0.1
		if s.voltage > 120 && rand.Float64() < 0.02 {
			s.voltPhase = 0
		}
	}

	t := Telemetry{
		Timestamp: time.Now().UnixMilli(),
		Speed:     s.speed,
		Temp:      s.temp,
		Pressure:  s.pressure,
		Fuel:      s.fuel,
		Voltage:   s.voltage,
		Error:     false,
	}

	if rand.Float64() < 0.005 {
		if rand.Intn(2) == 0 {
			t.Speed = 255.0 + rand.Float64()*10.0
		} else {
			t.Speed = -5.0
		}
		t.Error = true
	}
	if rand.Float64() < 0.005 {
		if rand.Intn(2) == 0 {
			t.Temp = 160.0
		} else {
			t.Temp = -90.0
		}
		t.Error = true
	}
	if rand.Float64() < 0.005 {
		if rand.Intn(2) == 0 {
			t.Pressure = 16.0
		} else {
			t.Pressure = -1.0
		}
		t.Error = true
	}
	if rand.Float64() < 0.005 {
		if rand.Intn(2) == 0 {
			t.Fuel = 10000.0
		} else {
			t.Fuel = -10.0
		}
		t.Error = true
	}
	if rand.Float64() < 0.005 {
		if rand.Intn(2) == 0 {
			t.Voltage = 160.0
		} else {
			t.Voltage = -5.0
		}
		t.Error = true
	}

	return t
}

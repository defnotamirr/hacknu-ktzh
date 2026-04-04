package storage

import(
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	_ "github.com/lib/pq"
 
	"github.com/xyn3x/hacknu-ktzh/services/processing/internal/model"
)

type DB struct {
	db *sql.DB
}

func New(dsn string) (*DB, error) {
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		return nil, fmt.Errorf("TimescaleDB Ping: %w", err)
	}

	s := &DB{db: db}
	err = s.migrate()
	if err != nil {
		return nill, err
	}

	return s, nil
}

func (s *DB) migrate() error {
	_, err := s.db.Exec(`
		CREATE EXTENSION IF NOT EXISTS timescaledb;
 
		CREATE TABLE IF NOT EXISTS telemetry (
			ts        TIMESTAMPTZ      NOT NULL,
			speed     REAL,
			temp      REAL,
			pressure  REAL,
			fuel      REAL,
			voltage   REAL,
			error     BOOLEAN,
			health    REAL,
			alerts    JSONB
		);
 
		-- Turn table into a hypertable partitioned by time (1 hour chunks)
		SELECT create_hypertable(
			'telemetry', 'ts',
			if_not_exists => TRUE,
			chunk_time_interval => INTERVAL '1 hour'
		);
 
		-- Compress chunks older than 1 hour to save disk space
		ALTER TABLE telemetry SET (
			timescaledb.compress,
			timescaledb.compress_orderby = 'ts DESC'
		);
 
		SELECT add_compression_policy(
			'telemetry',
			INTERVAL '1 hour',
			if_not_exists => TRUE
		);
	`)
	return err
}

func (s *DB) Save(f *model.ProcessedFrame) error {
	alertsJSON, _ := json.Marshal(f.Alerts)
	ts := time.UnixMilli(f.Timestamp)
	_, err := s.db.Exec(`
		INSERT INTO telemetry (ts, speed, temp, pressure, fuel, voltage, error, health, alerts)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
		ts, f.Speed, f.Temp, f.Pressure, f.Fuel, f.Voltage, f.Error, f.Health, alertsJSON,
	)
	return err
}

func (s *DB) History(from int64, lim int) ([]model.ProcessedFrame, error) {
	rows, err := s.db.Query(`
		SELECT ts, speed, temp, pressure, fuel, voltage, error, health, alerts
		FROM telemetry
		WHERE ts > $1
		ORDER BY ts ASC
		LIMIT $2`,
		time.UnixMilli(from), limit,
	)
	if err != nil {
		return nil, err 
	}
	defer rows.Close()
	
	var frames []model.ProcessedFrame
	for rows.Next() {
		var cur model.ProcessedFrame
		var timeSt time.Time
		var alertsJSON []byte
		err := rows.Scan(&timeSt, &cur.Speed, &cur.Temp, &cur.Pressure, &cur.Fuel, &cur.Voltage, &cur.Error, &cur.Health, &alertsJSON)
		if err != nil {
			return nil, err 
		}
		cur.Timestamp = ts.UnixMilli()
		_ = json.Unmarshal(alertsJSON, &cur.Alerts)
		frames = append(frames, cur)
	}
	return frames, nil 
}

// 1 min avg
func (s *DB) Downsample(from int64, lim int) ([]model.ProcessedFrame, error) {
	rows, err := s.db.Query(`
		SELECT
			time_bucket('1 minute', ts)  AS ts,
			AVG(speed)                   AS speed,
			AVG(temp)                    AS temp,
			AVG(pressure)                AS pressure,
			AVG(fuel)                    AS fuel,
			AVG(voltage)                 AS voltage,
			BOOL_OR(error)               AS error,
			AVG(health)                  AS health,
			'[]'::jsonb                  AS alerts
		FROM telemetry
		WHERE ts > $1
		GROUP BY 1
		ORDER BY 1 ASC
		LIMIT $2`,
		time.UnixMilli(from), limit,
	)
	if err != nil {
		return nil, err 
	}
	defer rows.Close()
	
	var frames []model.ProcessedFrame
	for rows.Next() {
		var cur model.ProcessedFrame
		var timeSt time.Time
		var alertsJSON []byte
		err := rows.Scan(&timeSt, &cur.Speed, &cur.Temp, &cur.Pressure, &cur.Fuel, &cur.Voltage, &cur.Error, &cur.Health, &alertsJSON)
		if err != nil {
			return nil, err 
		}
		cur.Timestamp = ts.UnixMilli()
		_ = json.Unmarshal(alertsJSON, &cur.Alerts)
		frames = append(frames, cur)
	}
	return frames, nil 
}

func (s *DB) Close() { s.db.Close() }
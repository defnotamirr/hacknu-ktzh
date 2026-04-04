package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"strings"
	"syscall"
 
	"github.com/xyn3x/hacknu-ktzh/services/processing/internal/storage"
	"github.com/xyn3x/hacknu-ktzh/service/processing/internal/stream"
)

func main() {
	brokers := strings.Split(env("REDPANDA_BROKERS", "localhost:9092"), ",")

	pgDSN := env("POSTGRES_DSN", "postgres://postgres:postgres@localhost:5432/telemetry?sslmode=disable")

	db, err := storage.New(pgDSN)
	if err != nil {
		log.Fatal("Postgres Error:", err)
	}
	defer db.Close()
	log.Println("Connected to Postgres")

	consumer := stream.NewConsumer(brokers, db)
	defer consumer.Close()

	ctx, cancel := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer cancel()

	log.Println("Processing Running, Brokers:", brokers)
	consumer.Start(ctx) 
}

func env(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
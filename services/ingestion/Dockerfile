# apps/ingestion-service/Dockerfile
FROM golang:1.26

WORKDIR /app

COPY . .

RUN go mod init ingestion && go mod tidy
RUN go build -o main .

CMD ["./main"]
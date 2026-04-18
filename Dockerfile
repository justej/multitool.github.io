FROM golang:1.23-alpine AS builder
WORKDIR /build
COPY multitool.go .
RUN go build -o multitool multitool.go

FROM alpine:3.21
WORKDIR /app
COPY --from=builder /build/multitool .
COPY index.html style.css app.js registry.js ui.js ./
COPY fonts/ ./fonts/
COPY tools/ ./tools/

ENV PORT=8000
EXPOSE 8000
CMD ["./multitool"]

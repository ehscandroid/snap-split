# API Gateway (Go)

A lightweight reverse proxy API gateway built with Go's standard library. Routes incoming requests to backend microservices, enforces HTTP method restrictions, logs all traffic, and auto-generates Swagger documentation.

## Features

- **Reverse proxy routing** — maps path prefixes to backend services
- **Method filtering** — restricts each route to allowed HTTP methods
- **Request logging** — appends every request to `request.log` (timestamp, method, path, status, duration)
- **Swagger UI** — auto-generated OpenAPI 3.0 spec served at `/swagger.json` with interactive docs at `/docs`
- **Zero external dependencies** — uses only Go standard library (`net/http`, `net/http/httputil`)
- **Docker support** — multi-stage Dockerfile for minimal production images

## Project Structure

```
.
├── main.go           # Application entry point, routes, middleware, handlers
├── go.mod            # Go module definition
├── go.sum            # Dependency checksums
├── Dockerfile        # Multi-stage Docker build
├── .gitignore
├── bin/              # Compiled binaries (gitignored)
└── request.log       # Request log output (gitignored)
```

## Routes

Routes are defined as a slice of `Route` structs in `main.go`:

```go
type Route struct {
    Path    string   `json:"path"`
    Target  string   `json:"target"`
    Methods []string `json:"methods"`
    Tag     string   `json:"tag"`
    Summary string   `json:"summary"`
}
```

| Path     | Target                  | Methods           | Description              |
|----------|-------------------------|-------------------|--------------------------|
| /users   | http://localhost:8081   | GET, POST         | User service             |
| /status  | http://localhost:3001   | GET               | Status service           |
| /orders  | http://localhost:8082   | GET, POST, PUT, DELETE | Order service       |

To add a route, append to the `routes` slice in `main.go`:

```go
{
    Path:    "/products",
    Target:  "http://localhost:8083",
    Methods: []string{"GET", "POST"},
    Tag:     "Products",
    Summary: "Operations related to products",
},
```

## Endpoints

| Endpoint         | Description                        |
|------------------|------------------------------------|
| `/docs`          | Swagger UI (interactive API docs)  |
| `/swagger.json`  | OpenAPI 3.0 spec (JSON)            |
| `/users/*`       | Proxied to user service            |
| `/status/*`      | Proxied to status service          |
| `/orders/*`      | Proxied to order service           |

## Request Logging

Every request is logged to `request.log` in append mode with the format:

```
<timestamp> <method> <path> <status_code> <duration>
```

Example:

```
2026-03-31T12:09:35+02:00 GET /users 200 12.345ms
2026-03-31T12:09:36+02:00 POST /orders 201 45.678ms
2026-03-31T12:09:37+02:00 DELETE /orders/5 405 0.123ms
```

## Getting Started

### Prerequisites

- Go 1.22+

### Run locally

```bash
go run main.go
```

### Build

```bash
go build -o bin/api-gateway .
./bin/api-gateway
```

### Docker

```bash
docker build -t api-gateway .
docker run -p 3000:8080 api-gateway
```

> Note: The Dockerfile exposes port 8080. Update the `EXPOSE` directive or `addr` in `main.go` to match your setup.

## Configuration

The gateway port is set in `main.go`:

```go
addr := ":3000"
```

Backend targets are set per route in the `routes` slice. There is no external config file — all configuration is code-based.

## License

---

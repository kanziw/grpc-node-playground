# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

gRPC Node.js playground comparing two TypeScript gRPC frameworks side-by-side:
- **connect-es/** — ConnectRPC (`@connectrpc/connect`) with `http2` + Fastify HTTP gateway
- **ts-proto/** — ts-proto code generation + Mali framework (gRPC-JS wrapper) + Fastify HTTP gateway

Both implement the same `EchoService` (unary, server/client/bidi streaming) defined in `proto/echo/v1/echo.proto`.

## Commands

```bash
# Setup (brew bundle → mise install → yarn install)
task default

# Code generation from .proto files
task generate:proto        # buf generate --include-imports

# Run both servers in watch mode
task run                   # connect-es on :8080/:8085, ts-proto on :8081/:8086

# Testing (servers must be running)
task test:e2e              # TypeScript e2e clients
task test:e2e:grpcurl      # grpcurl CLI tests

# Code quality
task format                # proto (buf format) + TypeScript (biome)
task lint:proto             # buf lint
```

## Architecture

Each framework directory (`connect-es/`, `ts-proto/`) mirrors the same structure:
- `main.ts` — starts both HTTP (Fastify) and gRPC servers
- `grpcServer.ts` — gRPC server setup
- `httpServer.ts` — Fastify HTTP gateway that proxies to the gRPC server
- `handlers/` — RPC method implementations
- `interceptors/` — cross-cutting concerns (logging, stats)
- `grpcGateway/` — HTTP-to-gRPC bridging logic
- `__proto__/` — generated code (do not edit)

Client e2e tests live in `connect-es-client/` and `ts-proto-client/`.

## Key Conventions

- **ESM-only** (`"type": "module"` in package.json, `moduleResolution: NodeNext`)
- **Path alias** `~/*` maps to project root (configured in tsconfig.json)
- **Biome** for linting/formatting (single quotes, semicolons, 2-space indent, 180 line width)
- **Yarn 4 (Berry)** with PnP — use `yarn` not `npm`
- **buf** for proto linting, formatting, and code generation
- **mise** for tool version management (node, buf) — see `mise.toml`
- **Task** (go-task) for all dev commands — see `Taskfile.yaml`

## Port Map

| Server | HTTP | gRPC |
|--------|------|------|
| connect-es | 8080 | 8085 |
| ts-proto | 8081 | 8086 |

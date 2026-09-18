#!/usr/bin/env bash
# Start Caddy as an HTTP/2 reverse proxy for local Electric SQL development.
# Electric's long-polling shapes benefit from HTTP/2 multiplexing; Vite's
# dev server only supports HTTP/1.1 (6 concurrent connections per domain).
# Access the app at https://localhost:3010 instead of http://localhost:3000.
set -euo pipefail

if ! command -v caddy &>/dev/null; then
	echo "Caddy is not installed."
	echo "  brew install caddy"
	echo "  caddy trust"
	exit 1
fi

exec caddy reverse-proxy \
	--from localhost:3010 \
	--to localhost:3000 \
	--internal-certs

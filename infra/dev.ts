/**
 * Local development helpers.
 *
 * Caddy provides an HTTP/2 reverse proxy for Electric SQL's concurrent
 * long-polling streams, avoiding Vite's HTTP/1.1 connection limit (6
 * concurrent connections per domain). Access the app at
 * https://localhost:3010 instead of http://localhost:3000.
 *
 * Requires Caddy to be installed: `brew install caddy && caddy trust`
 */
export const caddy = new sst.x.DevCommand("Caddy", {
	dev: {
		autostart: true,
		command: "bash scripts/start-caddy.sh",
	},
});
